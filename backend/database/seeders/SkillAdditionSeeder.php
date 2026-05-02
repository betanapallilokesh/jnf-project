<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillAdditionSeeder extends Seeder
{
    public function run()
    {
        $skills = [
            // Languages
            'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart', 'C#',
            // ML/Data
            'TensorFlow', 'PyTorch', 'Keras', 'Scikit-Learn', 'Pandas', 'OpenCV',
            // Web/App Frameworks
            'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Express.js', 'Flutter', 'React Native', 'Tailwind CSS',
            // DB/Ops/Other
            'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Linux'
        ];

        foreach ($skills as $s) {
            Skill::firstOrCreate(['name' => $s]);
        }
    }
}
