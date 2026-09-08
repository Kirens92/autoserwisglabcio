import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import glabcioLogo from "./lib/glabcioLogo";
import "./index.css";

const applyBrandLogo = () => {
  document
    .querySelectorAll<HTMLImageElement>(
      'img[alt="Auto Serwis Gl@bcio"], img[alt="Logo Auto Serwis Gl@bcio"]',
    )
    .forEach((image) => {
      if (image.src !== glabcioLogo) {
        image.src = glabcioLogo;
        image.decoding = "async";
      }
    });
};

createRoot(document.getElementById("root")!).render(<App />);

requestAnimationFrame(applyBrandLogo);

const brandLogoObserver = new MutationObserver(applyBrandLogo);
brandLogoObserver.observe(document.getElementById("root")!, {
  childList: true,
  subtree: true,
});
