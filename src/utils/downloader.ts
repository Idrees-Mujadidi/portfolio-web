import { PERSONAL_INFO, SKILL_CATEGORIES, WORK_EXPERIENCE, EDUCATION_LIST, CERTIFICATIONS, PROJECTS } from '../data';

export function downloadAcademicResume() {
  const separator = '='.repeat(80);
  const thinSeparator = '-'.repeat(80);

  const cvContent = `
${separator}
${PERSONAL_INFO.name.toUpperCase()}
${PERSONAL_INFO.title.toUpperCase()}
${separator}

Email:      ${PERSONAL_INFO.email}
GitHub:     ${PERSONAL_INFO.github}
LinkedIn:   ${PERSONAL_INFO.linkedin}
Location:   ${PERSONAL_INFO.location}

${thinSeparator}
PROFESSIONAL SUMMARY
${thinSeparator}
${PERSONAL_INFO.summary}

${thinSeparator}
TECHNICAL STACK & CORE COMPLEXITIES MATRIX
${thinSeparator}
${SKILL_CATEGORIES.map(cat => {
  return `* [${cat.name}]
  - Solutions: ${cat.skills.join(', ')}
  - Level of Competency: ${cat.level}%`;
}).join('\n\n')}

${thinSeparator}
CHRONOLOGICAL DEVELOPMENT & ENGINEERING EXPERIENCE
${thinSeparator}
${WORK_EXPERIENCE.map(exp => {
  return `▸ ${exp.role.toUpperCase()}
  Company:   ${exp.company}
  Period:    ${exp.period}
  Scope & Achievements:
${exp.description.map(desc => `  - ${desc}`).join('\n')}`;
}).join('\n\n')}

${thinSeparator}
VERIFIED ACADEMIC ACCREDITATION & DEGREE
${thinSeparator}
${EDUCATION_LIST.map(edu => {
  return `▸ ${edu.degree}
  Institution: ${edu.school}
  Duration:    ${edu.year}
  Specialization detail: ${edu.details}`;
}).join('\n\n')}

${thinSeparator}
STANDARDIZED CERTIFIED CREDENTIALS
${thinSeparator}
${CERTIFICATIONS.map(cert => `[✔] ${cert}`).join('\n')}

${thinSeparator}
REPRESENTATIVE PROJECTS
${thinSeparator}
${PROJECTS.map(proj => {
  return `▸ ${proj.name}
  Stack:       ${proj.tech.join(', ')}
  Highlights:  ${proj.description}`;
}).join('\n\n')}

${separator}
Generated dynamically via live peer shell context: ${new Date().toUTCString()}
${separator}
`;

  // Create text file blob
  const blob = new Blob([cvContent.trim()], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  // Create virtual link anchor
  const link = document.createElement('a');
  link.href = url;
  link.download = `Idrees_Mujadidi_CV.txt`;
  
  // Append to body, click, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
