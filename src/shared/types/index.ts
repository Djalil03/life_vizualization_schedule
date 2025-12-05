interface BaseEvent {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    categoryId: 'education' | 'career' | 'projects' | 'personal';
    relatedTo: string[];
}

interface WorkEvent extends BaseEvent {
    type: 'work';
    details: {
        role: string;
        company?: string;
        stack: string[];
    }
}

interface ProjectEvent extends BaseEvent {
    type: 'project';
    details: {
        client: string;
        stack: string[];
    }
}

interface StudyEvent extends BaseEvent {
    type: 'study';
    details: {
        faculty: string;
        degree: 'Бакалавр' | 'Магистр' | 'Докторант' | 'Курсы';
    };
}

export type Event = WorkEvent | ProjectEvent | StudyEvent;
