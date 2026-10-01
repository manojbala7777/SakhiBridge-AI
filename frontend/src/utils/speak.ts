export function speak(text: string, locale: string): boolean {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = locale;

  // Find the best available voice for the locale
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang === locale && v.name.includes("Female")) ||
    voices.find(v => v.lang === locale) ||
    voices.find(v => v.name.includes("Female"));

  if (preferredVoice) {
    u.voice = preferredVoice;
  }

  window.speechSynthesis.speak(u);
  return true;
}
