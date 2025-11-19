import { NextRequest, NextResponse } from 'next/server';
import { WELCOME_SEQUENCE_STEPS, VisitorJourney } from '@/types/community';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for visitor journeys
const visitorJourneys = new Map<string, VisitorJourney>();

// Calculate lead temperature based on qualification score
function calculateLeadTemperature(score: number): 'cold' | 'warm' | 'hot' {
  if (score >= 25) return 'hot';
  if (score >= 12) return 'warm';
  return 'cold';
}

// Generate personalized message based on journey
function generatePersonalizedMessage(journey: VisitorJourney): string {
  const temp = journey.leadTemperature;
  const struggle = journey.answers['struggle_identification'];
  const urgency = journey.answers['urgency_check'];

  if (temp === 'hot') {
    if (struggle === 'marriage') {
      return "I can tell your marriage situation is weighing heavily on you. You're not alone - thousands of men have been exactly where you are right now. The difference is what you do next.";
    }
    if (struggle === 'sin') {
      return "The fact that you're here and willing to face this head-on tells me you're ready for real change. Not surface-level accountability group stuff - actual biblical transformation.";
    }
    return "You're serious about this. That puts you ahead of 90% of men who just keep drifting. Let me show you exactly what to do next.";
  }

  if (temp === 'warm') {
    if (struggle === 'spiritual') {
      return "Spiritual growth isn't an accident - it's intentional. And you're in the right place to make that happen.";
    }
    if (struggle === 'leadership') {
      return "Leadership without biblical foundation is just worldly management. You're looking for something deeper - and you'll find it here.";
    }
    return "You're asking the right questions. Let me help you find the answers.";
  }

  // Cold lead
  return "Take a look around. When you're ready to go deeper, everything you need is here.";
}

// GET - Fetch current journey state for visitor
export async function GET(request: NextRequest) {
  try {
    const visitorId = request.nextUrl.searchParams.get('visitorId');

    if (!visitorId) {
      return NextResponse.json(
        { error: 'visitorId required' },
        { status: 400 }
      );
    }

    let journey = visitorJourneys.get(visitorId);

    if (!journey) {
      // Create new journey
      journey = {
        visitorId,
        sessionId: uuidv4(),
        currentStep: WELCOME_SEQUENCE_STEPS[0].id,
        completedSteps: [],
        qualificationScore: 0,
        leadTemperature: 'cold',
        startedAt: new Date().toISOString(),
        lastInteraction: new Date().toISOString(),
        answers: {},
      };
      visitorJourneys.set(visitorId, journey);
    }

    // Get current step details
    const currentStep = WELCOME_SEQUENCE_STEPS.find(s => s.id === journey.currentStep);

    return NextResponse.json({
      success: true,
      journey,
      currentStep,
      progress: (journey.completedSteps.length / WELCOME_SEQUENCE_STEPS.length) * 100,
    });
  } catch (error) {
    console.error('Welcome sequence GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch welcome sequence' },
      { status: 500 }
    );
  }
}

// POST - Record answer and advance to next step
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, stepId, answer } = body;

    if (!visitorId || !stepId) {
      return NextResponse.json(
        { error: 'visitorId and stepId required' },
        { status: 400 }
      );
    }

    let journey = visitorJourneys.get(visitorId);

    if (!journey) {
      return NextResponse.json(
        { error: 'Journey not found - start with GET first' },
        { status: 404 }
      );
    }

    // Find the current step
    const step = WELCOME_SEQUENCE_STEPS.find(s => s.id === stepId);
    if (!step) {
      return NextResponse.json(
        { error: 'Invalid step ID' },
        { status: 400 }
      );
    }

    // Record answer if provided
    if (answer) {
      journey.answers[stepId] = answer;

      // Calculate qualification score from answer
      if (step.options) {
        const selectedOption = step.options.find(o => o.value === answer);
        if (selectedOption) {
          journey.qualificationScore += selectedOption.qualificationScore;
        }
      }
    }

    // Mark step as completed
    if (!journey.completedSteps.includes(stepId)) {
      journey.completedSteps.push(stepId);
    }

    // Advance to next step
    const currentStepIndex = WELCOME_SEQUENCE_STEPS.findIndex(s => s.id === stepId);
    const nextStep = WELCOME_SEQUENCE_STEPS[currentStepIndex + 1];

    if (nextStep) {
      journey.currentStep = nextStep.id;
    } else {
      // Sequence complete
      journey.currentStep = 'completed';
    }

    // Update lead temperature
    journey.leadTemperature = calculateLeadTemperature(journey.qualificationScore);

    // Generate personalized message
    journey.personalizedMessage = generatePersonalizedMessage(journey);

    // Update timestamp
    journey.lastInteraction = new Date().toISOString();

    // Save updated journey
    visitorJourneys.set(visitorId, journey);

    // Track in analytics
    await fetch(`${request.nextUrl.origin}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        sessionId: journey.sessionId,
        type: 'custom',
        data: {
          event: 'welcome_sequence_step',
          step: stepId,
          answer,
          qualificationScore: journey.qualificationScore,
          leadTemperature: journey.leadTemperature,
        },
        timestamp: new Date().toISOString(),
      }),
    });

    return NextResponse.json({
      success: true,
      journey,
      nextStep,
      completed: journey.currentStep === 'completed',
      leadTemperature: journey.leadTemperature,
      personalizedMessage: journey.personalizedMessage,
    });
  } catch (error) {
    console.error('Welcome sequence POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process welcome sequence' },
      { status: 500 }
    );
  }
}

// PATCH - Skip to specific step or complete sequence
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, action } = body;

    if (!visitorId) {
      return NextResponse.json(
        { error: 'visitorId required' },
        { status: 400 }
      );
    }

    const journey = visitorJourneys.get(visitorId);

    if (!journey) {
      return NextResponse.json(
        { error: 'Journey not found' },
        { status: 404 }
      );
    }

    if (action === 'skip_all') {
      journey.currentStep = 'completed';
      journey.leadTemperature = 'cold'; // They skipped, so they're cold
      journey.personalizedMessage = "No problem - explore at your own pace. Everything's here when you're ready.";
    }

    visitorJourneys.set(visitorId, journey);

    return NextResponse.json({
      success: true,
      journey,
    });
  } catch (error) {
    console.error('Welcome sequence PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update welcome sequence' },
      { status: 500 }
    );
  }
}
