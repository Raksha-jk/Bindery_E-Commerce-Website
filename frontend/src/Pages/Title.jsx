import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

export default function Title() {
  const titleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = titleRef.current;

    // Fade in
    gsap.to(el, {
      duration: 1.5,
      opacity: 1,
      y: 0,
      ease: "power3.out",
    });

    // Letter spacing animation
    gsap.fromTo(
      el,
      { letterSpacing: "2rem" },
      {
        letterSpacing: "0.3rem",
        duration: 2,
        ease: "power2.out",
        delay: 0.5,
      }
    );

    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div
      style={{
        background: "#fdfbf6",
        fontFamily: "Georgia, serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <img
        src="/images/logo.png" // make sure logo is in public/images/
        alt="Logo"
        style={{ width: "120px", marginBottom: "20px" }}
      />

      <h1
        ref={titleRef}
        style={{
          fontSize: "5rem",
          letterSpacing: "0.3rem",
          color: "#2f2f2f",
          opacity: 0,
          transform: "translateY(20px)",
          margin: 0,
        }}
      >
        Bindery
      </h1>
    </div>
  );
}
