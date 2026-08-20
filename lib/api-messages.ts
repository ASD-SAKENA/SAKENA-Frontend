/**
 * Persian wording for the backend's domain messages.
 *
 * The API answers in English by design (its own convention), but those strings
 * reach the user verbatim in a conflict toast. Each entry matches on a stable
 * fragment rather than the whole sentence, so a message that interpolates a
 * unit number still resolves.
 */
const CONFLICT_TRANSLATIONS: { match: RegExp; fa: string }[] = [
  {
    match: /already has a current resident/i,
    fa: "این واحد در حال حاضر ساکن دارد. برای تخصیص ساکن جدید، ابتدا سکونت فعلی را پایان دهید.",
  },
  {
    match: /already occupies another unit/i,
    fa: "این کاربر هم‌اکنون ساکن واحد دیگری است و نمی‌تواند هم‌زمان دو واحد داشته باشد.",
  },
  {
    match: /cannot move into a unit/i,
    fa: "واحد فقط به حساب ساکن تخصیص داده می‌شود. با یک حساب ساکن وارد شوید.",
  },
  {
    match: /staff cannot be registered as a unit resident/i,
    fa: "کارکن خدماتی نمی‌تواند به‌عنوان ساکن واحد ثبت شود.",
  },
  {
    match: /invitation was issued for a different person/i,
    fa: "این دعوت‌نامه برای شخص دیگری صادر شده است.",
  },
  {
    match: /invitation (link )?is no longer|is no longer pending|has expired/i,
    fa: "این لینک دعوت دیگر معتبر نیست. از مدیر ساختمان دعوت تازه‌ای بخواهید.",
  },
];

/** Falls back to the original text when no translation matches. */
export function toPersianApiMessage(message: string): string {
  return (
    CONFLICT_TRANSLATIONS.find((t) => t.match.test(message))?.fa ?? message
  );
}
