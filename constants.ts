
import { RoutineMap } from './types';

export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxx2iCp9PgKa2XcY_zZuhvCjN0BeCrthAa93OjHPNDpRr9zXgozhpKi9zZcoEfjGHl6/exec";

export const defaultRoutines: RoutineMap = {
    // --- User Provided Data ---
    'Wake Up': [
        { type: 'work', name: 'Bounce & Breathe', duration: 60 },
        { type: 'rep_work', name: 'Shoulder Pinches', exercises: ['10 Reps'] },
        { type: 'rep_work', name: 'Arm Circles', exercises: ['10 Fwd / 10 Bwd'] },
        { type: 'rep_work', name: 'RDL', duration: 30, exercises: ['10 Reps'] },
        { type: 'rep_work', name: 'Single Leg RDL', duration: 30, exercises: ['10 Reps total'] },
        { type: 'rep_work', name: 'Inchworm', duration: 30, exercises: ['5 Reps'] },
        { type: 'rep_work', name: 'Hip Bridges', exercises: ['10 Reps + Hold'] },
        { type: 'rep_work', name: 'Windshield Wipers', exercises: ['10 Reps'] },
        { type: 'rep_work', name: 'Leg Hug, Point/Flex (R)', duration: 30, exercises: ['10 Reps'] },
        { type: 'rep_work', name: 'Leg Hug, Point/Flex (L)', duration: 30, exercises: ['10 Reps'] },
        { type: 'rep_work', name: 'Cat-Cow', duration: 30, exercises: ['10 Reps'] },
        { type: 'rep_work', name: 'Bird Dogs', duration: 30, exercises: ['10 Reps'] },
        { type: 'work', name: "Child's Pose", duration: 60 }
    ],
    'Morning Workout': [
        { type: 'work', name: 'Push-ups', round: '1/4', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Push-ups', round: '2/4', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Push-ups', round: '3/4', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Push-ups', round: '4/4', duration: 10 }, { type: 'rest', name: 'Switch', duration: 30 },
        { type: 'work', name: 'Air Squats', round: '1/4', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Air Squats', round: '2/4', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Air Squats', round: '3/4', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Air Squats', round: '4/4', duration: 10 }, { type: 'rest', name: 'Switch', duration: 30 },
        { type: 'work', name: 'Burpees', round: '1/4', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Burpees', round: '2/4', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Burpees', round: '3/4', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Burpees', round: '4/4', duration: 10 }, { type: 'rest', name: 'Switch', duration: 30 },
        { type: 'work', name: 'Mountain Climbers', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Mountain Climbers', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Mountain Climbers', duration: 10 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'work', name: 'Mountain Climbers', duration: 10 }
    ],
    'Cooldown Flow': [
        { type: 'cooldown', name: 'Lizard (R)', duration: 30 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Lunge (R)', duration: 30 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Lizard (L)', duration: 30 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Lunge (L)', duration: 30 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Elevated Pigeon (R)', duration: 30 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Elevated Pigeon (L)', duration: 30 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Pec Stretch (R)', duration: 30 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Pec Stretch (L)', duration: 30 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Warrior Pose (R)', duration: 45 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Warrior Pose (L)', duration: 45 }, { type: 'rest', name: 'Rest', duration: 10 },
        { type: 'cooldown', name: 'Meditate', duration: 180 }
    ],
    'Garage Games': [
         { type: "amrap", name: "AMRAP 20", duration: 1200, round: "Garage Games", exercises: ["10 Med Ball Cleans", "10 Pull-Ups", "40 Double Unders"] }
    ],
    'Pop-Eye': [
        { type: 'work', name: 'Suitcase Hold (R)', round: '1/6', duration: 60 }, { type: 'rest', name: 'Rest', duration: 5 },
        { type: 'work', name: 'Suitcase Hold (L)', round: '2/6', duration: 60 }, { type: 'rest', name: 'Rest', duration: 5 },
        { type: 'work', name: 'Suitcase Hold (R)', round: '3/6', duration: 60 }, { type: 'rest', name: 'Rest', duration: 5 },
        { type: 'work', name: 'Suitcase Hold (L)', round: '4/6', duration: 60 }, { type: 'rest', name: 'Rest', duration: 5 },
        { type: 'work', name: 'Suitcase Hold (R)', round: '5/6', duration: 60 }, { type: 'rest', name: 'Rest', duration: 5 },
        { type: 'work', name: 'Suitcase Hold (L)', round: '6/6', duration: 60 }, { type: 'rest', name: 'Rest', duration: 5 },
        { type: 'rep_work', name: 'KB Flips (Pyramid)', exercises: ['10, 20, 30, 40, 50, 40, 30, 20, 10'] }
    ],
    'The Afterburner': [
        { type: 'rep_work', name: 'Warmup: High Knees', duration: 30, exercises: ['30 Seconds'] },
        { type: 'rep_work', name: 'Warmup: Butt Kicks', duration: 30, exercises: ['30 Seconds'] },
        { type: 'rep_work', name: 'Warmup: Walking Lunges', duration: 60, exercises: ['60 Seconds'] },
        { type: 'rep_work', name: 'Warmup: A-Skips', duration: 60, exercises: ['60 Seconds'] },
        { type: 'rest', name: 'Get Ready', duration: 60 },
        { type: 'rep_work', name: 'Sprint 100m', round: '1/10', exercises: ['95% Effort (or 20s Jump Rope)'] }, { type: 'rest', name: 'Recover', duration: 90 },
        { type: 'rep_work', name: 'Sprint 100m', round: '2/10', exercises: ['95% Effort (or 20s Jump Rope)'] }, { type: 'rest', name: 'Recover', duration: 90 },
        { type: 'rep_work', name: 'Sprint 100m', round: '3/10', exercises: ['95% Effort (or 20s Jump Rope)'] }, { type: 'rest', name: 'Recover', duration: 90 },
        { type: 'rep_work', name: 'Sprint 100m', round: '4/10', exercises: ['95% Effort (or 20s Jump Rope)'] }, { type: 'rest', name: 'Recover', duration: 90 },
        { type: 'rep_work', name: 'Sprint 100m', round: '5/10', exercises: ['95% Effort (or 20s Jump Rope)'] }, { type: 'rest', name: 'Recover', duration: 90 },
        { type: 'rep_work', name: 'Sprint 100m', round: '6/10', exercises: ['95% Effort (or 20s Jump Rope)'] }, { type: 'rest', name: 'Recover', duration: 90 },
        { type: 'rep_work', name: 'Sprint 100m', round: '7/10', exercises: ['95% Effort (or 20s Jump Rope)'] }, { type: 'rest', name: 'Recover', duration: 90 },
        { type: 'rep_work', name: 'Sprint 100m', round: '8/10', exercises: ['95% Effort (or 20s Jump Rope)'] }, { type: 'rest', name: 'Recover', duration: 90 },
        { type: 'rep_work', name: 'Sprint 100m', round: '9/10', exercises: ['95% Effort (or 20s Jump Rope)'] }, { type: 'rest', name: 'Recover', duration: 90 },
        { type: 'rep_work', name: 'Sprint 100m', round: '10/10', exercises: ['ALL OUT EFFORT'] }
    ],
    'Time Under Tension': [
        { type: 'rep_work', name: 'A1. Split Squat (R/L)', round: 'Set 1/3', exercises: ['10-12 Reps (3 sec down)'] },
        { type: 'rep_work', name: 'A2. Banded Push-Up', round: 'Set 1/3', exercises: ['Failure (3 sec down)'] }, { type: 'rest', name: 'Rest', duration: 60 },
        { type: 'rep_work', name: 'A1. Split Squat (R/L)', round: 'Set 2/3', exercises: ['10-12 Reps (3 sec down)'] },
        { type: 'rep_work', name: 'A2. Banded Push-Up', round: 'Set 2/3', exercises: ['Failure (3 sec down)'] }, { type: 'rest', name: 'Rest', duration: 60 },
        { type: 'rep_work', name: 'A1. Split Squat (R/L)', round: 'Set 3/3', exercises: ['10-12 Reps (3 sec down)'] },
        { type: 'rep_work', name: 'A2. Banded Push-Up', round: 'Set 3/3', exercises: ['Failure (3 sec down)'] }, { type: 'rest', name: 'Transition', duration: 60 },
        { type: 'rep_work', name: 'B1. Chin-Ups', round: 'Set 1/3', exercises: ['Near Failure (3 sec down)'] },
        { type: 'rep_work', name: 'B2. Single Leg RDL', round: 'Set 1/3', exercises: ['12 Reps (3 sec down)'] }, { type: 'rest', name: 'Rest', duration: 60 },
        { type: 'rep_work', name: 'B1. Chin-Ups', round: 'Set 2/3', exercises: ['Near Failure (3 sec down)'] },
        { type: 'rep_work', name: 'B2. Single Leg RDL', round: 'Set 2/3', exercises: ['12 Reps (3 sec down)'] }, { type: 'rest', name: 'Rest', duration: 60 },
        { type: 'rep_work', name: 'B1. Chin-Ups', round: 'Set 3/3', exercises: ['Near Failure (3 sec down)'] },
        { type: 'rep_work', name: 'B2. Single Leg RDL', round: 'Set 3/3', exercises: ['12 Reps (3 sec down)'] }, { type: 'rest', name: 'Transition', duration: 60 },
        { type: 'rep_work', name: 'Finisher: DB Flyes', round: 'Max Effort', exercises: ['Failure (Stretch Focus)'] }
    ],
    'Core Crusher': [
        { type: 'work', name: 'Ab Wheel Rollout', round: '1/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Laying Leg Lifts', round: '1/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'RKC Plank', round: '1/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Side Plank (R)', round: '1/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Side Plank (L)', round: '1/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Ab Wheel Rollout', round: '2/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Laying Leg Lifts', round: '2/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'RKC Plank', round: '2/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Side Plank (R)', round: '2/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Side Plank (L)', round: '2/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Ab Wheel Rollout', round: '3/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Laying Leg Lifts', round: '3/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'RKC Plank', round: '3/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Side Plank (R)', round: '3/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 },
        { type: 'work', name: 'Side Plank (L)', round: '3/3', duration: 40 }, { type: 'rest', name: 'Rest', duration: 20 }
    ],

    // --- Mapped Daily Protocols (Aliased to Specific Workouts) ---
    // These link the generic Day names to the specific workouts above
    'Monday Protocol': [
        { type: "amrap", name: "AMRAP 20", duration: 1200, round: "Garage Games", exercises: ["10 Med Ball Cleans", "10 Pull-Ups", "40 Double Unders"] }
    ],
    'Tuesday Protocol': [
        { type: 'work', name: 'Suitcase Hold (R)', round: '1/6', duration: 60 }, { type: 'rest', name: 'Rest', duration: 5 },
        { type: 'work', name: 'Suitcase Hold (L)', round: '2/6', duration: 60 }, { type: 'rest', name: 'Rest', duration: 5 },
        { type: 'rep_work', name: 'KB Flips (Pyramid)', exercises: ['10, 20, 30, 40, 50...'] }
    ],
    'Wednesday Protocol': [
        { type: 'rep_work', name: 'Sprints', duration: 1200, exercises: ['The Afterburner Routine'] }
    ],
    'Thursday Protocol': [
        { type: 'rep_work', name: 'Time Under Tension', duration: 600, exercises: ['Full Body Slow Tempo'] }
    ],
    'Friday Protocol': [
        { type: 'work', name: 'Core Crusher', duration: 900 }
    ],
    'Saturday Protocol': [{ type: 'work', name: 'Outdoor Activity', duration: 1800 }],
    'Sunday Protocol': [{ type: 'work', name: 'Mobility Flow', duration: 600 }]
};
