export default function TwoFactorEmail({ token }: { token: string }) {
  return (
    <>
      <h3>Verification Code</h3>

      <p>
        Enter the code below to login to <strong>{process.env.APP_NAME}</strong>
        . This code can only be used once and expires in 10 minutes.
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

      <p>Did not try to login? Please, ignore this message.</p>

      <p>If the code is expired, try to login again.</p>
    </>
  );
}
