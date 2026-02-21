import { VocabularyMode } from "@/types"

export const getNextVocabularyMode = (currentMode = VocabularyMode.latest): VocabularyMode => {
    let newMode = currentMode;

    switch (currentMode) {
        case VocabularyMode.week:
            newMode = VocabularyMode.latest;
            break;
        case VocabularyMode.random:
            newMode = VocabularyMode.week;
            break;
        case VocabularyMode.latest:
            newMode = VocabularyMode.random;
            break;
        default:
            newMode = VocabularyMode.random;
            break;
    }

    return newMode;
};