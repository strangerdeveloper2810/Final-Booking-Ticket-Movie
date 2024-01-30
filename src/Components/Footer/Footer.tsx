import React from "react";

const Footer: React.FC = () => {
  return (
    <React.Fragment>
      <footer className="flex justify-center text-2xl subpixel-antialiased">
        Design By Stranger Developer ©.
      </footer>
    </React.Fragment>
  );
};

export default React.memo(Footer);
