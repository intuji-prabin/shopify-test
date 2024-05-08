import { useConditionalRender } from "~/hooks/useAuthorization";

export default function CertificateGeneration() {
  const shouldRender = useConditionalRender('conformance_certificates');

  return (
    shouldRender && (<div className="container">
      <h2>Certificate Generation</h2>

      <iframe
        src="demo_iframe.htm"
        height="200"
        width="300"
        title="Iframe Example"
      ></iframe>
    </div>)
  );
}
