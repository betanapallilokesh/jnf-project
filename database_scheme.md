# JNF Project Database Schema

This diagram illustrates the complete database structure and relationships between the various entities in the JNF (Job Notification Form) project. 

```mermaid
erDiagram
    %% Core Entities
    COMPANY {
        int id PK
        string name
        string website
        text description
        string logo_path
    }
    
    RECRUITER {
        int id PK
        int company_id FK
        string name
        string email
        string phone
        string designation
    }
    
    ADMIN {
        int id PK
        string name
        string email
    }

    JNF {
        int id PK
        int company_id FK
        int created_by_id FK "Recruiter"
        int reviewed_by_id FK "Admin"
        string status
        string job_title
        string job_description
        string place_of_posting
    }

    %% JNF Details
    JNF_ELIGIBILITY_RULE {
        int id PK
        int jnf_id FK
        float cgpa_cutoff
        float tenth_percent_cutoff
        float twelfth_percent_cutoff
        int max_backlogs
    }

    JNF_DECLARATION {
        int id PK
        int jnf_id FK
        string agreed_by
        date agreed_at
    }

    JNF_CONTACT {
        int id PK
        int jnf_id FK
        string contact_type
        string name
        string email
        string phone
    }

    JNF_SALARY_PACKAGE {
        int id PK
        int jnf_id FK
        int programme_id FK
        float ctc
        float basic_pay
        string currency
    }

    JNF_SALARY_COMPONENT {
        int id PK
        int jnf_salary_package_id FK
        string component_name
        float amount
    }

    JNF_SELECTION_ROUND {
        int id PK
        int jnf_id FK
        string round_type
        text description
        int sequence_order
    }

    JNF_DOCUMENT {
        int id PK
        int jnf_id FK
        string file_name
        string file_path
    }

    JNF_AUDIT_LOG {
        int id PK
        int jnf_id FK
        string action
        text changes
        timestamp created_at
    }

    %% Master Data & Taxonomies
    INDUSTRY_TAG {
        int id PK
        string name
    }

    SKILL {
        int id PK
        string name
    }

    PROGRAMME {
        int id PK
        string name
        string duration
    }

    DISCIPLINE {
        int id PK
        string name
        string short_name
    }

    %% Relationships

    %% Company & Users
    COMPANY ||--o{ RECRUITER : "employs"
    COMPANY ||--o{ JNF : "posts"
    COMPANY }|--|{ INDUSTRY_TAG : "has tags"
    
    RECRUITER ||--o{ JNF : "creates/manages"
    ADMIN ||--o{ JNF : "reviews/approves"

    %% JNF 1-to-1 relationships
    JNF ||--o| JNF_ELIGIBILITY_RULE : "defines"
    JNF ||--o| JNF_DECLARATION : "signs"
    
    %% JNF 1-to-many relationships
    JNF ||--o{ JNF_CONTACT : "has POCs"
    JNF ||--o{ JNF_SALARY_PACKAGE : "offers"
    JNF ||--o{ JNF_SELECTION_ROUND : "requires"
    JNF ||--o{ JNF_DOCUMENT : "includes"
    JNF ||--o{ JNF_AUDIT_LOG : "tracks history"
    
    %% JNF many-to-many relationships
    JNF }|--|{ SKILL : "requires"
    JNF }|--|{ PROGRAMME : "targets"
    JNF }|--|{ DISCIPLINE : "targets"

    %% Salary Package breakdowns
    JNF_SALARY_PACKAGE ||--o{ JNF_SALARY_COMPONENT : "breaks down into"
    JNF_SALARY_PACKAGE }o--|| PROGRAMME : "applicable for"

    %% Master data relationships
    PROGRAMME ||--o{ DISCIPLINE : "includes"
