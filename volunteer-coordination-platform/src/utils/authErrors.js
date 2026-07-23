const FRIENDLY_MESSAGES = {
  "Invalid login credentials":
    "Hmm, that email or password doesn't look right. Give it another try?",
  "User already registered":
    "Looks like there's already an account with that email. Try logging in instead."
};

export function getFriendlyAuthError(error) {
  if (!error) return "";
  return (
    FRIENDLY_MESSAGES[error.message] ||
    "Something went a bit sideways on our end. Mind trying that again?"
  );
}