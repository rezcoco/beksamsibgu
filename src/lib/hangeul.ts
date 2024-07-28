const leadingConsonants = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
const vowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
const trailingConsonants = [null, 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

const baseOfSyllable = 0xAC00; //44032
const endOfSyllble = 0xD7A3
const baseOfLeadingConsonant = 0x1100
const baseOfVowel = 0x1161
const baseOfTrailingConsonant = 0x1147
const numberOfLeadingConsonant = 19;
const numberOfVowel = 21;
const numberOfTrailingConsonant = 28;
const numberOfSyllableForEachLeadingConsonant = numberOfVowel * numberOfTrailingConsonant //588
const numberOfSyllable = numberOfLeadingConsonant * numberOfSyllableForEachLeadingConsonant //11171

export function isValidSyllable(syllable: string) {
  const indexOfSyllable = syllable.charCodeAt(0) - baseOfSyllable
  return indexOfSyllable >= 0 ? true : false
}

export function getValidSyllable(syllable: string) {
  let validSyllable = ""

  for (let i = 0; i < syllable.length; i++) {
    const currentSyllable = syllable.charAt(i)
    if (isValidSyllable(currentSyllable)) {
      validSyllable += currentSyllable
    }
  }

  return validSyllable
}

export function composeHangul(initial: string, medial: string, final: string | null) {
  const LIndex = leadingConsonants.indexOf(initial)
  const VIndex = vowels.indexOf(medial)
  const TIndex = trailingConsonants.indexOf(final)

  if (LIndex === -1 || VIndex === -1 || TIndex === -1) {
    return "Invalid jamo input"
  }

  const codePoint = baseOfSyllable + (LIndex * numberOfSyllableForEachLeadingConsonant) + (VIndex * numberOfTrailingConsonant) + TIndex
  return String.fromCharCode(codePoint)
}

export function decomposeHangul(syllable: string) {
  const code = syllable.charCodeAt(0);
  const indexOfSyllable = code - baseOfSyllable;

  const leadingIndex = Math.floor(indexOfSyllable / numberOfSyllableForEachLeadingConsonant);
  const vowelIndex = Math.floor((indexOfSyllable % numberOfSyllableForEachLeadingConsonant) / numberOfTrailingConsonant);
  const trailingIndex = indexOfSyllable % numberOfTrailingConsonant;

  return {
    leadingConsonant: leadingConsonants[leadingIndex],
    vowel: vowels[vowelIndex],
    trailingConsonant: trailingConsonants[trailingIndex]
  };
}