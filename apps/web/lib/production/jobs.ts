import { JobStatus, DcaModel } from '@petrosquare/types';
import { db } from './db';
import { MonteCarloSimulation } from './analytics/monte-carlo';
import { events } from './events';

// Simple UUID generator
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class JobService {
  static async submitMonteCarlo(model: DcaModel, iterations: number = 100, horizonMonths: number = 24): Promise<JobStatus> {
    const job: JobStatus = {
      id: generateId(),
      type: 'MONTE_CARLO',
      status: 'QUEUED',
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.createJob(job);

    // Start processing in background (simulated)
    this.processMonteCarlo(job.id, model, iterations, horizonMonths);

    return job;
  }

  private static async processMonteCarlo(jobId: string, model: DcaModel, iterations: number, horizonMonths: number) {
    try {
        await db.updateJob(jobId, { status: 'RUNNING', progress: 10 });

        // Simulate some delay if needed, or just compute
        // For demo UI effect, let's wait 1s
        await new Promise(resolve => setTimeout(resolve, 1000));

        await db.updateJob(jobId, { progress: 50 });

        const result = MonteCarloSimulation.run(model, iterations, horizonMonths);

        await db.updateJob(jobId, {
            status: 'COMPLETED',
            progress: 100,
            result: result
        });

        events.emitJobCompleted(jobId, 'MONTE_CARLO');
    } catch (error: any) {
        console.error("Job failed", error);
        await db.updateJob(jobId, {
            status: 'FAILED',
            error: error.message
        });
    }
  }

  static async getStatus(jobId: string): Promise<JobStatus | undefined> {
    return db.getJob(jobId);
  }
}
