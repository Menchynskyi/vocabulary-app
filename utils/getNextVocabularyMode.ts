import { VocabularyMode } from "@/types"

export const getNextVocabularyMode = (currentMode: VocabularyMode): VocabularyMode => {
    let newMode = currentMode;

    switch (currentMode) {
        case VocabularyMode.week:
            newMode = VocabularyMode.random;
            break;
        case VocabularyMode.random:
            newMode = VocabularyMode.latest;
            break;
        case VocabularyMode.latest:
            newMode = VocabularyMode.week;
            break;
        default:
            newMode = VocabularyMode.week;
            break;
    }

    return newMode;
};