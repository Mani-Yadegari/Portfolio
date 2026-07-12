import { useEffect, useState, useCallback } from "react";
import Hero from "./Components/Hero.jsx";
import Projects from "./Components/Projects.jsx";
import Loader from "./Components/Loading.jsx";
import "./Styles.css";
import About from "./Components/About.jsx";
import Contact from "./Components/Contact.jsx";

const PAGE_ORDER = ["hero", "projects", "about", "contact"];
const ANIM_DURATION = 1300;

const MIN_LOADER_TIME = 1200; // حداقل زمان نمایش لودر (جلوگیری از چشمک‌زدن سریع)
const LOADER_EXIT_DURATION = 400; // باید با انیمیشن exit توی Loading.css هماهنگ باشه
const MAX_WAIT = 8000; // اگه asset ای گیر کرد (مثلاً عکس خراب)، بعد این مدت به‌هرحال رد شو

// اسم کلاس section به ازای هر صفحه - برای پیدا کردن container فعال و
// چک کردن اینکه آیا اسکرول داخلیش به ته/سر رسیده یا نه.
// اگه اسم کلاس Projects section چیز دیگه‌ایه، همینجا اصلاحش کن.
const SECTION_CLASS = {
  hero: "hero-section",
  projects: "projects-section",
  about: "about-section",
  contact: "contact-section",
};

const SCROLL_EDGE_THRESHOLD = 2; // px تلورانس برای رسیدن به لبه اسکرول
const TOUCH_SWIPE_THRESHOLD = 60; // px حداقل جابجایی انگشت برای شمردنش به عنوان سوایپ صفحه

function App() {
  const [loading, setLoading] = useState(true);
  const [exitLoader, setExitLoader] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [revealed, setRevealed] = useState(false); // کنترل جدا برای trigger شدن ترنزیشن ورود

  const [currentPage, setCurrentPage] = useState("hero");
  const [prevPage, setPrevPage] = useState(null);
  const [direction, setDirection] = useState("forward");
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useCallback(
    (to) => {
      if (loading || isAnimating || currentPage === to) return;

      const fromIdx = PAGE_ORDER.indexOf(currentPage);
      const toIdx = PAGE_ORDER.indexOf(to);
      const dir = toIdx > fromIdx ? "forward" : "backward";

      setDirection(dir);
      setPrevPage(currentPage);
      setCurrentPage(to);
      setIsAnimating(true);

      setTimeout(() => {
        setPrevPage(null);
        setIsAnimating(false);
      }, ANIM_DURATION);
    },
    [loading, isAnimating, currentPage],
  );

  // پیدا کردن المنت section ای که الان فعاله، تا وضعیت اسکرول داخلیش رو بخونیم
  const getActiveSectionEl = useCallback(() => {
    const cls = SECTION_CLASS[currentPage];
    return cls ? document.querySelector(`.${cls}`) : null;
  }, [currentPage]);

  // آیا بخش فعال به لبه‌ی اسکرول داخلیش (بالا برای backward، پایین برای forward) رسیده؟
  // اگه اصلاً اسکرول‌پذیر نباشه (مثل حالت دسکتاپ)، همیشه true برمی‌گردونه
  // یعنی رفتار قبلی (عوض شدن فوری صفحه) حفظ میشه.
  const isAtScrollBoundary = useCallback(
    (dir) => {
      const el = getActiveSectionEl();
      if (!el) return true;

      const isScrollable =
        el.scrollHeight > el.clientHeight + SCROLL_EDGE_THRESHOLD;
      if (!isScrollable) return true;

      if (dir === "forward") {
        return (
          el.scrollTop + el.clientHeight >=
          el.scrollHeight - SCROLL_EDGE_THRESHOLD
        );
      }
      return el.scrollTop <= SCROLL_EDGE_THRESHOLD;
    },
    [getActiveSectionEl],
  );

  useEffect(() => {
    const handleWheel = (e) => {
      if (loading || isAnimating) return;
      const idx = PAGE_ORDER.indexOf(currentPage);
      if (e.deltaY > 50 && idx < PAGE_ORDER.length - 1) {
        if (isAtScrollBoundary("forward")) navigate(PAGE_ORDER[idx + 1]);
      } else if (e.deltaY < -50 && idx > 0) {
        if (isAtScrollBoundary("backward")) navigate(PAGE_ORDER[idx - 1]);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentPage, isAnimating, loading, navigate, isAtScrollBoundary]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (loading || isAnimating) return;
      const idx = PAGE_ORDER.indexOf(currentPage);
      const fwd = e.key === "ArrowDown" || e.key === "ArrowRight";
      const bwd = e.key === "ArrowUp" || e.key === "ArrowLeft";
      if (fwd && idx < PAGE_ORDER.length - 1) navigate(PAGE_ORDER[idx + 1]);
      else if (bwd && idx > 0) navigate(PAGE_ORDER[idx - 1]);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, isAnimating, loading, navigate]);

  // ناوبری با سوایپ لمسی (موبایل). چون رویداد wheel روی گوشی فایر نمیشه،
  // اینجا با touchstart/touchend فاصله‌ی عمودی انگشت رو می‌سنجیم.
  // منطق مشابه handleWheel: فقط وقتی بخش فعال به لبه‌ی اسکرول داخلیش
  // رسیده باشه، سوایپ باعث رفتن به صفحه بعد/قبل میشه؛ در غیر این صورت
  // اسکرول عادیِ داخل بخش (native) اتفاق می‌افته و دست نمی‌خوریم بهش.
  useEffect(() => {
    let touchStartY = null;

    const handleTouchStart = (e) => {
      if (loading || isAnimating) return;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (loading || isAnimating || touchStartY === null) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY; // مثبت = سوایپ به بالا = رفتن جلو
      touchStartY = null;

      const idx = PAGE_ORDER.indexOf(currentPage);

      if (deltaY > TOUCH_SWIPE_THRESHOLD && idx < PAGE_ORDER.length - 1) {
        if (isAtScrollBoundary("forward")) navigate(PAGE_ORDER[idx + 1]);
      } else if (deltaY < -TOUCH_SWIPE_THRESHOLD && idx > 0) {
        if (isAtScrollBoundary("backward")) navigate(PAGE_ORDER[idx - 1]);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage, isAnimating, loading, navigate, isAtScrollBoundary]);

  // تنظیمات اولیه صفحه
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // حداقل زمان نمایش لودر، تا خیلی سریع محو نشه
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), MIN_LOADER_TIME);
    return () => clearTimeout(t);
  }, []);

  // لود واقعی: فونت‌ها + عکس‌ها (+ پل برای Lottie)
  useEffect(() => {
    let cancelled = false;
    const pending = new Set();
    let fontsDone = false;

    const tryFinish = () => {
      if (cancelled) return;
      if (fontsDone && pending.size === 0) setAssetsReady(true);
    };

    const trackImg = (img) => {
      if (pending.has(img) || img.complete) return;
      pending.add(img);
      const done = () => {
        pending.delete(img);
        tryFinish();
      };
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    };

    // عکس‌های فعلی صفحه
    document.querySelectorAll("img").forEach(trackImg);

    // عکس‌هایی که بعداً با رندر شدن کامپوننت‌ها اضافه میشن
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.tagName === "IMG") trackImg(node);
          node.querySelectorAll?.("img").forEach(trackImg);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // فونت‌ها
    document.fonts.ready.then(() => {
      fontsDone = true;
      tryFinish();
    });

    // پل عمومی برای asset هایی که بیرون از این افکت لود میشن (مثل Lottie)
    window.registerLoaderAsset = (id) => {
      pending.add(id);
    };
    window.resolveLoaderAsset = (id) => {
      pending.delete(id);
      tryFinish();
    };

    // اگه چیزی گیر کرد، بعد MAX_WAIT به‌هرحال رد شو
    const safety = setTimeout(() => {
      if (!cancelled) setAssetsReady(true);
    }, MAX_WAIT);

    return () => {
      cancelled = true;
      observer.disconnect();
      clearTimeout(safety);
      delete window.registerLoaderAsset;
      delete window.resolveLoaderAsset;
    };
  }, []);

  // وقتی هم asset ها آماده شدن و هم حداقل زمان گذشت، لودر رو ببند
  useEffect(() => {
    if (assetsReady && minTimePassed && loading) {
      setExitLoader(true);
      const t = setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = "hidden";
      }, LOADER_EXIT_DURATION);
      return () => clearTimeout(t);
    }
  }, [assetsReady, minTimePassed, loading]);

  // بعد از اینکه لودر کامل رفت و visibility به حالت عادی برگشت،
  // یه فریم صبر می‌کنیم و بعد "revealed" رو true می‌کنیم تا show
  // از false به true تغییر کنه و ترنزیشن ورود درست trigger بشه.
  // (اگه همون لحظه‌ی loading=false این کارو بکنیم، مرورگر فرصت
  // نمی‌کنه حالت اولیه‌ی hidden رو paint کنه و ترنزیشن دیده نمیشه)
  useEffect(() => {
    if (!loading) {
      const raf = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [loading]);

  const pageProps = (name) => ({
    show: revealed && currentPage === name,
    exit: prevPage === name,
    direction,
  });

  return (
    <>
      {loading && <Loader exit={exitLoader} />}

      <div
        className="app"
        style={
          loading ? { visibility: "hidden", pointerEvents: "none" } : undefined
        }
      >
        <Hero
          {...pageProps("hero")}
          onNavigateToHero={() => navigate("hero")}
          onNavigateToProjects={() => navigate("projects")}
          onNavigateToAbout={() => navigate("about")}
          onNavigateToContact={() => navigate("contact")}
        />

        <Projects
          {...pageProps("projects")}
          onNavigateToHero={() => navigate("hero")}
          onNavigateToProjects={() => navigate("projects")}
          onNavigateToAbout={() => navigate("about")}
          onNavigateToContact={() => navigate("contact")}
        />

        <About
          {...pageProps("about")}
          onNavigateToHero={() => navigate("hero")}
          onNavigateToProjects={() => navigate("projects")}
          onNavigateToAbout={() => navigate("about")}
          onNavigateToContact={() => navigate("contact")}
        />

        <Contact
          {...pageProps("contact")}
          onNavigateToHero={() => navigate("hero")}
          onNavigateToProjects={() => navigate("projects")}
          onNavigateToAbout={() => navigate("about")}
          onNavigateToContact={() => navigate("contact")}
        />
      </div>
    </>
  );
}

export default App;
