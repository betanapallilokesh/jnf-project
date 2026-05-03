const fs = require('fs');
const content = fs.readFileSync('node_modules/react-icons/si/index.d.ts', 'utf8');

const tests = [
  'SiTypescript', 'SiGo', 'SiRust', 'SiRuby', 'SiPhp', 'SiSwift', 'SiKotlin', 'SiDart', 'SiCsharp',
  'SiTensorflow', 'SiPytorch', 'SiKeras', 'SiScikitlearn', 'SiPandas', 'SiOpencv',
  'SiNextdotjs', 'SiVuedotjs', 'SiAngular', 'SiSvelte', 'SiDjango', 'SiFlask', 'SiSpringboot', 'SiLaravel', 'SiExpress', 'SiFlutter', 'SiMongodb', 'SiPostgresql', 'SiDocker', 'SiKubernetes', 'SiAmazonaws', 'SiMicrosoftazure', 'SiGit', 'SiLinux', 'SiTailwindcss'
];

tests.forEach(t => {
  if (content.includes(`export declare const ${t}:`)) {
    console.log(`FOUND: ${t}`);
  } else {
    // Try case insensitive search to find alternatives
    const regex = new RegExp(`export declare const Si[A-Za-z]*${t.replace('Si', '').substring(0, 4)}[A-Za-z]*:`, 'gi');
    const matches = content.match(regex);
    console.log(`NOT FOUND: ${t}. Potential matches: ${matches ? matches.map(m => m.split(' ')[3].replace(':','')).join(', ') : 'None'}`);
  }
});
