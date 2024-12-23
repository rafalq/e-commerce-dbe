export default function PasswordResetEmail({
  link,
  appName,
}: {
  link: string;
  appName: string;
}) {
  return (
    <div>
      <h3>Password Reset</h3>
      <p>
        We received a request to reset the password for the{" "}
        <strong>{appName}</strong> account associated with this email address.
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
          Reset Your Password
        </a>
      </div>
      <p>If you didn’t make this request, ignore this message.</p>
      <p>No changes have been made to your account.</p>
      <p>
        - <strong>{appName}</strong>
      </p>
    </div>
  );
}
