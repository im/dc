export const word = (word:any, pron:any, interpret:any, syllables:any = '' ) => {
    return {
        'interpret': interpret,
        'syllables': syllables || word,
        'uk_pron': pron,
        'us_pron': pron,
        'word': word
    }
}