export function calculateSM2(quality, easeFactor = 2.5, repetitions = 0, interval = 0) {
    if (quality < 1 || quality > 5) throw new Error("Quality score must be between 1 and 5.");
    let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;
    let newRepetitions = 0;
    let newInterval = 0;
    if (quality >= 3) {
        if (repetitions === 0) newInterval = 1;
        else if (repetitions === 1) newInterval = 6;
        else newInterval = Math.round(interval * newEaseFactor);
        newRepetitions = repetitions + 1;
    } else {
        newRepetitions = 0;
        newInterval = 1;
    }
    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);
    return {
        easeFactor: parseFloat(newEaseFactor.toFixed(2)),
        repetitions: newRepetitions,
        intervalDays: newInterval,
        nextReviewAt: nextReviewAt.toISOString(),
    };
}
