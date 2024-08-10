export interface Content {
    id: string;
    courseId: string;
    title: string;
    type: 'video' | 'document' | 'quiz';
    url: string;
    duration?: number; // for videos
  }