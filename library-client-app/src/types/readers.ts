// types.ts
export interface Reader {
    id: number;
    name: string;
    birth_date: Date;
    library_id: number;
    attributes: Record<string, string | number>;
  }

export interface Student extends Reader {
    university: string;
    faculty: string;
    course: string;
    group_number: number;
}

export interface Schoolboy extends Reader {
    school_addr: string;
    school_class: number;
}

export interface Scientist extends Reader {
    organization: string;
    research_topic: string;
}

export interface Teacher extends Reader {
    subject: string;
    school_addr: string;
}

export interface Worker extends Reader {
    organization: string;
    position: string;
}


export interface Retiree extends Reader {
    organization: string;
    experience: number;
}