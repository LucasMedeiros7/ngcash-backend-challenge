export function validatePassword(password: string): boolean {
  if (password.length < 8 || !containUpperCaseLetters(password) || !containNumbers(password)) {
    return false;
  }
  return true;
}

function containUpperCaseLetters(password: string) {
  const upperCaseRegex = /[A-Z]/g;
  return upperCaseRegex.test(password);
}

function containNumbers(password: string) {
  const numberRegex = /[0-9]/g;
  return numberRegex.test(password);
}
