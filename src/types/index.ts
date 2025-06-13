// types/index.ts
export interface Project {
    id: number
    title: string
    description: string
    image: string
    techStack: string[]
    githubUrl?: string
    liveUrl?: string
    featured?: boolean
  }
  
  export interface Skill {
    name: string
    level: number
    category: 'language' | 'framework' | 'tool' | 'expertise'
  }
  
  export interface Resume {
    id: string
    file_url: string
    file_name: string
    is_active: boolean
    created_at: string
    updated_at: string
  }
  
  export interface User {
    id: string
    email: string
    isAdmin: boolean
  }
  