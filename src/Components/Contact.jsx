import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import "./Styles/Contact.css";
import TelegramLogo from "../assets/Images/Telegram.svg";
import GitHubLogo from "../assets/Images/GitHub.svg";
import ResumeEN from "../assets/ManiYadegari-ResumeEN.pdf";
import emailjs from "@emailjs/browser";
import {
  Mail,
  ArrowRight,
  FileText,
  UserRound,
  MessageCircleMore,
  File,
  CloudUpload,
  LockKeyhole,
  Zap,
  Globe,
  CircleDot,
  Image,
  FileArchive,
  FileCode,
  X,
} from "lucide-react";

function Contact({
  show,
  exit,
  onNavigateToHero,
  onNavigateToProjects,
  onNavigateToAbout,
  onNavigateToContact,
}) {
  const [loaded, setLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [removingFile, setRemovingFile] = useState(false);
  const fileInputRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const toastTimeout = useRef();
  useEffect(() => {
    return () => {
      clearTimeout(toastTimeout.current);
    };
  }, []);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setLoaded(true), 100);
      return () => clearTimeout(timer);
    } else {
      setLoaded(false);
    }
  }, [show]);
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const files = e.dataTransfer.files;

    if (files && files.length) {
      handleFileChange({ target: { files } });
    }
  };

  const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      );

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);

          resolve({
            url: data.secure_url,
            resourceType: data.resource_type,
            publicId: data.public_id,
          });
        } else {
          console.error(xhr.responseText);

          let message = "Upload failed";

          try {
            message = JSON.parse(xhr.responseText).error?.message || message;
          } catch {}

          reject(message);
        }
      };

      xhr.onerror = () => reject("Network Error");

      xhr.send(formData);
    });
  };
  const handleFileChange = async (e) => {
    if (selectedFile || isUploading) return;
    const file = e.target.files[0];

    if (!file) return;

    // محدودیت حجم (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast("error", "Maximum file size is 10MB.");
      return;
    }

    // فرمت‌های مجاز
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Only PDF, DOC, DOCX, PNG and JPG files are allowed.");
      return;
    }

    setSelectedFile(file);

    setUploadProgress(0);
    setIsUploading(true);
    setIsUploaded(false);
    setUploadedFileUrl("");

    try {
      const result = await uploadToCloudinary(file);

      setUploadedFileUrl(result.url);
      setUploadProgress(100);
      setIsUploaded(true);
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        typeof error === "string"
          ? error
          : "File upload failed. Please try again.",
      );

      removeFile();
    } finally {
      setIsUploading(false);
    }
  };
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";

    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";

    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };
  const getFileIcon = (file) => {
    if (!file) return <CloudUpload />;

    const type = file.type;

    if (type.startsWith("image/")) return <Image size={24} />;

    if (type.includes("zip") || type.includes("rar"))
      return <FileArchive size={24} />;

    if (
      type.includes("javascript") ||
      type.includes("json") ||
      type.includes("html") ||
      type.includes("css")
    )
      return <FileCode size={24} />;

    return <FileText size={24} />;
  };
  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsUploaded(false);
    setUploadedFileUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setRemovingFile(true);

    setTimeout(() => {
      removeFile();
      setRemovingFile(false);
    }, 300); // برابر مدت انیمیشن
  };
  const showToast = (type, message) => {
    clearTimeout(toastTimeout.current);

    setToast({
      show: true,
      type,
      message,
    });

    toastTimeout.current = setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3500);
  };
  const sendEmail = async (e) => {
    e.preventDefault();
    if (isSending) return;
    if (
      !import.meta.env.VITE_EMAILJS_SERVICE_ID ||
      !import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
      !import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ) {
      showToast("error", "Email service is not configured.");
      return;
    }

    if (selectedFile && !uploadedFileUrl) {
      showToast("error", "Please wait until the upload is complete.");
      return;
    }

    const form = e.target;
    setIsSending(true);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: form.name.value,
          email: form.email.value,
          subject: form.subject.value,
          message: form.message.value,
          attachment: uploadedFileUrl || "",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      showToast("success", "Your message has been sent successfully!");

      form.reset();

      removeFile();
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  const [showCVModal, setShowCVModal] = useState(false);
  const downloadResume = (file, filename) => {
    const link = document.createElement("a");

    link.href = file;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowCVModal(false);
  };

  return (
    <section
      className={`contact-section ${show ? "show" : ""} ${exit ? "exit" : ""} ${loaded ? "loaded" : ""} ${!show && !exit ? "hidden" : ""}`}
    >
      <div className="box">
        <Navbar
          activePage="contact"
          onNavigateToHero={onNavigateToHero}
          onNavigateToProjects={onNavigateToProjects}
          onNavigateToAbout={onNavigateToAbout}
          onNavigateToContact={onNavigateToContact}
        />
        <div className="container">
          <div className="social">
            <div className="social-top">
              <span className="status">
                <span className="dot"></span>Available For Freelance
              </span>
              <h3>Choose your preferred way</h3>
            </div>
            <div className="platform">
              <div className="title">
                <div className="circle">
                  <Mail size={30} />
                </div>
                <div className="desc">
                  <p>Email</p>
                  <span>Send me an email anytime.</span>
                </div>
              </div>
              <a href="mailto:maniyadegari8478@gmail.com">
                maniyadegari8478@gmail.com
              </a>

              <button
                onClick={() =>
                  (window.location.href = "mailto:maniyadegari8478@gmail.com")
                }
              >
                <ArrowRight size={24} />
              </button>
            </div>
            <div className="platform">
              <div className="title">
                <div className="circle">
                  <img src={TelegramLogo} alt="" />
                </div>
                <div className="desc">
                  <p>Telegram</p>
                  <span>Let's chat on Telegram.</span>
                </div>
              </div>
              <a href="https://t.me/Reoll96" target="_blank" rel="noreferrer">
                @Reoll96
              </a>

              <button
                onClick={() =>
                  window.open(
                    "https://t.me/Reoll96",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <ArrowRight size={24} />
              </button>
            </div>
            <div className="platform">
              <div className="title">
                <div className="circle">
                  <img src={GitHubLogo} alt="" />
                </div>
                <div className="desc">
                  <p>GitHub</p>
                  <span>Check out my code and contributions.</span>
                </div>
              </div>
              <a
                href="https://github.com/Mani-Yadegari"
                target="_blank"
                rel="noreferrer"
              >
                github.com/Mani-Yadegari
              </a>

              <button
                onClick={() =>
                  window.open(
                    "https://github.com/Mani-Yadegari",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <ArrowRight size={24} />
              </button>
            </div>
            <div className="platform">
              <div className="title">
                <div className="circle">
                  <FileText size={30} />
                </div>
                <div className="desc">
                  <p>Download CV</p>
                  <span>View or download my resume.</span>
                </div>
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowCVModal(true);
                }}
              >
                Download PDF
              </a>

              <button onClick={() => setShowCVModal(true)}>
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
          <div className="form">
            <div className="title">
              <div className="left">
                <div className="circle">
                  <MessageCircleMore size={27} />
                </div>
              </div>
              <div className="right">
                <h2>Send Me a Message</h2>
                <p>
                  Fill out the form below and I'll get back to you as soon as
                  possible.
                </p>
              </div>
            </div>
            <form onSubmit={sendEmail}>
              <label htmlFor="name">Your Name</label>
              <div className="container">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  required
                />
                <UserRound size={22} />
              </div>
              <label htmlFor="email">Your Email</label>
              <div className="container">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  required
                />
                <Mail size={22} />
              </div>
              <label htmlFor="subject">Subject</label>
              <div className="container">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder="What's this about?"
                  required
                />
                <File size={22} />
              </div>
              <label htmlFor="message">Message</label>
              <div className="container">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Tell me about your project ..."
                  required
                />
              </div>
              <label htmlFor="">
                Attachment <span>(Optional)</span>
              </label>
              <div className="upload-box">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  hidden
                  onChange={handleFileChange}
                />

                {!selectedFile ? (
                  <label
                    htmlFor="file"
                    className={`drop-area ${isDragging ? "dragging" : ""}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="box">
                      <CloudUpload />
                    </div>

                    <div className="text">
                      {isDragging ? (
                        <>
                          <p>Drop your file here</p>
                          <p>Release to upload</p>
                        </>
                      ) : (
                        <>
                          <p>Click to upload or drag and drop</p>
                          <p>PDF, DOC, DOCX, PNG, JPG (Max 10MB)</p>
                        </>
                      )}
                    </div>
                  </label>
                ) : (
                  <div
                    className={`upload-preview
      ${isUploaded ? "uploaded" : ""}
      ${removingFile ? "removing" : ""}
`}
                  >
                    <div className="preview-top">
                      <div className="preview-left">
                        <div className={`icon ${isUploaded ? "success" : ""}`}>
                          {getFileIcon(selectedFile)}
                        </div>

                        <div className="info">
                          <p>{selectedFile.name}</p>

                          <span>
                            {isUploading ? "Uploading..." : "Ready to send"}
                          </span>
                        </div>
                      </div>

                      {!isUploading && (
                        <button
                          type="button"
                          className="remove-file"
                          onClick={handleRemoveFile}
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    <div className="progress">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(uploadProgress, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="progress-footer">
                      <span>{formatFileSize(selectedFile.size)}</span>

                      <span>{Math.floor(Math.min(uploadProgress, 100))}%</span>
                    </div>
                  </div>
                )}
              </div>
              <button type="submit" disabled={isUploading || isSending}>
                {isUploading
                  ? "Uploading file..."
                  : isSending
                    ? "Sending..."
                    : "Send Message"}

                {isSending ? (
                  <div className="spinner" />
                ) : (
                  <ArrowRight size={20} />
                )}
              </button>
              <div className="subline">
                <LockKeyhole size={18} />
                <span>Your information is safe and will never be shared.</span>
              </div>
            </form>
          </div>
          <div className="text">
            <h1>Contact</h1>
            <h2>Let's Build</h2>
            <h2>Something Amazing</h2>
            <p>
              Have a project in mind, a collaboration idea, or just want to say
              hello? I'd love to hear from you. Let's create something great
              together.
            </p>
            <div className="line">
              <div className="circle"></div>
            </div>
            <div className="item-container">
              <div className="item">
                <div className="frame">
                  <Zap />
                </div>
                <p>Fast Response</p>
                <span>I usually reply within 24 hours</span>
              </div>
              <div className="item">
                <div className="frame">
                  <Globe />
                </div>
                <p>Open to Work</p>
                <span>Available for freelance projects</span>
              </div>
              <div className="item">
                <div className="frame">
                  <CircleDot />
                </div>
                <p>Long-Term Focus</p>
                <span>Building scalable digital solutions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCVModal && (
        <div className="cv-modal-overlay" onClick={() => setShowCVModal(false)}>
          <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Select Resume Language</h2>

            <p>Choose which version of my resume you'd like to download.</p>

            <div className="cv-buttons">
              <button
                onClick={() =>
                  downloadResume(ResumeEN, "Mani-Yadegari-Resume-EN.pdf")
                }
              >
                <span>English Resume</span>
              </button>

              <button
                onClick={() =>
                  downloadResume(ResumeFA, "Mani-Yadegari-Resume-FA.pdf")
                }
              >
                <span>Persian Resume</span>
              </button>
            </div>

            <button
              className="close-modal"
              onClick={() => setShowCVModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"}
          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}

export default Contact;
