export default function VerificationEmail({
  link,
  appName,
}: {
  link: string;
  appName: string;
}) {
  return (
    <div>
      <h3>Email Verification</h3>
      <p>
        We received a request to verify the email for the{" "}
        <strong>{appName}</strong> account.
      </p>

      <div style={{ margin: "1rem 0" }}>
        <a
          href={link}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#175CB5",
            color: "#FFFFFF",
            textDecoration: "none",
            fontSize: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          Verify Your Email
        </a>
      </div>
      <p>If you didn’t make this request, ignore this messages.</p>
      <p>No changes have been made to your account.</p>
      <p>
        - <strong>{appName}</strong>
      </p>
    </div>
  );
}
