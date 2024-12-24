export default function TwoFactorEmail({ token }: { token: string }) {
  return (
    <>
      <h3>Confirmation Code</h3>

      <p>
        Enter the code below to sign in to{" "}
        <strong>{process.env.APP_NAME}</strong>.
      </p>
      <p>
        This code can only be used once and expires in <strong>1 hour</strong>.
      </p>

      <div
        style={{
          display: "inline",
          fontSize: "1.5rem",
          padding: "4px 8px",
          backgroundColor: "#D2D3DA",
        }}
      >
        {token}
      </div>

      <p>Did not try to sign in? Please, ignore this message.</p>
      <p>
        - <strong>{process.env.APP_NAME}</strong>
      </p>
    </>
  );
}
