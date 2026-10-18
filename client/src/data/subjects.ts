export interface SubjectDef {
  id: string
  name: string
  icon: string
  tagline: string
  color: string // tailwind-ish hex
  levels: ('school' | 'college')[]
  route: string
}

export const SCHOOL_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'Geography',
  'English',
]

export const COLLEGE_SUBJECTS = [
  'Programming',
  'Data Structures',
  'Algorithms',
  'Database Systems',
  'Operating Systems',
  'Computer Networks',
  'Artificial Intelligence',
  'Machine Learning',
  'Mathematics',
  'Physics',
  'Engineering Subjects',
]

export const COLLEGE_COURSES = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
  'Business Administration',
  'Mathematics',
  'Physics',
  'Other',
]

// Year 1 is deliberately foundational and largely shared across streams
// (every engineering/science course starts with core math, physics and
// intro programming). From Year 2 onward, subjects diverge sharply by
// stream — e.g. Biotechnology students see genetics/biochem, not CS theory.
export const COLLEGE_CURRICULUM: Record<string, Record<string, string[]>> = {
  'Computer Science': {
    'Year 1': ['Mathematics', 'Physics', 'Programming Fundamentals', 'Digital Logic Design', 'English'],
    'Year 2': ['Data Structures', 'Algorithms', 'Database Systems', 'Discrete Mathematics', 'Computer Organization'],
    'Year 3': ['Operating Systems', 'Computer Networks', 'Software Engineering', 'Theory of Computation', 'Artificial Intelligence'],
    'Year 4': ['Machine Learning', 'Cloud Computing', 'Distributed Systems', 'Cybersecurity', 'Capstone Project'],
  },
  'Information Technology': {
    'Year 1': ['Mathematics', 'Physics', 'Programming Fundamentals', 'Digital Logic Design', 'English'],
    'Year 2': ['Data Structures', 'Web Technologies', 'Database Systems', 'Computer Networks', 'Object-Oriented Programming'],
    'Year 3': ['Operating Systems', 'Cloud Computing', 'Information Security', 'Software Engineering', 'Mobile App Development'],
    'Year 4': ['DevOps & System Administration', 'Cybersecurity', 'Data Analytics', 'Enterprise Systems', 'Capstone Project'],
  },
  'Electronics & Communication': {
    'Year 1': ['Mathematics', 'Physics', 'Programming Fundamentals', 'Digital Logic Design', 'English'],
    'Year 2': ['Circuit Theory', 'Electronic Devices', 'Signals & Systems', 'Analog Electronics', 'Digital Electronics'],
    'Year 3': ['Microprocessors', 'Communication Systems', 'Control Systems', 'VLSI Design', 'Electromagnetic Theory'],
    'Year 4': ['Embedded Systems', 'Wireless Communication', 'IoT Systems', 'Signal Processing', 'Capstone Project'],
  },
  'Mechanical Engineering': {
    'Year 1': ['Mathematics', 'Physics', 'Programming Fundamentals', 'Engineering Graphics', 'English'],
    'Year 2': ['Thermodynamics', 'Mechanics of Materials', 'Fluid Mechanics', 'Manufacturing Processes', 'Material Science'],
    'Year 3': ['Machine Design', 'Heat Transfer', 'Kinematics of Machines', 'CAD/CAM', 'Industrial Engineering'],
    'Year 4': ['Robotics', 'Automotive Engineering', 'Thermal Power Systems', 'Mechatronics', 'Capstone Project'],
  },
  'Civil Engineering': {
    'Year 1': ['Mathematics', 'Physics', 'Engineering Graphics', 'Programming Fundamentals', 'English'],
    'Year 2': ['Structural Analysis', 'Surveying', 'Building Materials', 'Fluid Mechanics', 'Geotechnical Engineering'],
    'Year 3': ['Concrete Technology', 'Transportation Engineering', 'Environmental Engineering', 'Steel Structures', 'Hydrology'],
    'Year 4': ['Earthquake Engineering', 'Construction Management', 'Urban Planning', 'Foundation Engineering', 'Capstone Project'],
  },
  Biotechnology: {
    'Year 1': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    'Year 2': ['Cell Biology', 'Genetics', 'Biochemistry', 'Microbiology', 'Molecular Biology'],
    'Year 3': ['Genetic Engineering', 'Bioprocess Technology', 'Immunology', 'Bioinformatics', 'Plant Biotechnology'],
    'Year 4': ['Animal Biotechnology', 'Pharmaceutical Biotechnology', 'Bioethics & Regulation', 'Genomics', 'Capstone Project'],
  },
  'Business Administration': {
    'Year 1': ['Mathematics', 'English', 'Principles of Economics', 'Financial Accounting', 'Business Communication'],
    'Year 2': ['Marketing Management', 'Organizational Behavior', 'Corporate Finance', 'Business Statistics', 'Microeconomics'],
    'Year 3': ['Operations Management', 'Human Resource Management', 'Strategic Management', 'Business Law', 'Macroeconomics'],
    'Year 4': ['Entrepreneurship', 'International Business', 'Investment Analysis', 'Digital Marketing', 'Capstone Project'],
  },
  Mathematics: {
    'Year 1': ['Calculus', 'Linear Algebra', 'Physics', 'Programming Fundamentals', 'English'],
    'Year 2': ['Real Analysis', 'Abstract Algebra', 'Differential Equations', 'Probability Theory', 'Discrete Mathematics'],
    'Year 3': ['Complex Analysis', 'Numerical Methods', 'Topology', 'Statistics', 'Graph Theory'],
    'Year 4': ['Functional Analysis', 'Mathematical Modeling', 'Cryptography', 'Optimization Theory', 'Capstone Project'],
  },
  Physics: {
    'Year 1': ['Calculus', 'Mechanics', 'Programming Fundamentals', 'Chemistry', 'English'],
    'Year 2': ['Electromagnetism', 'Thermodynamics', 'Waves & Optics', 'Mathematical Physics', 'Modern Physics'],
    'Year 3': ['Quantum Mechanics', 'Statistical Mechanics', 'Solid State Physics', 'Nuclear Physics', 'Classical Mechanics'],
    'Year 4': ['Particle Physics', 'Astrophysics', 'Condensed Matter Physics', 'Computational Physics', 'Capstone Project'],
  },
}

export const SCHOOL_GRADES = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
export const COLLEGE_YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4']

// Grades 6-8 emphasize foundational breadth, 9-10 build toward board-exam
// depth, 11-12 lean into specialization/electives — same subject names as
// real-world curricula, but content difficulty should skew accordingly.
export const SCHOOL_GRADE_TIER: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {
  'Grade 6': 'Beginner',
  'Grade 7': 'Beginner',
  'Grade 8': 'Beginner',
  'Grade 9': 'Intermediate',
  'Grade 10': 'Intermediate',
  'Grade 11': 'Advanced',
  'Grade 12': 'Advanced',
}

export function collegeSubjectsFor(course: string, year: string): string[] {
  return COLLEGE_CURRICULUM[course]?.[year] ?? COLLEGE_SUBJECTS
}

export const LEARNING_PREFERENCES = [
  { id: 'visual', label: 'Watching visual explanations', icon: '🎬' },
  { id: 'interactive', label: 'Learning through interaction', icon: '🎮' },
  { id: 'reading', label: 'Reading explanations', icon: '📖' },
  { id: 'problems', label: 'Solving problems', icon: '🧩' },
  { id: 'audio', label: 'Listening to explanations', icon: '🎧' },
]

export const SUBJECT_WORLDS: SubjectDef[] = [
  { id: 'math', name: 'Mathematics', icon: '🔢', tagline: 'The Mathematics Dimension', color: '#5b9dff', levels: ['school', 'college'], route: '/world/math' },
  { id: 'physics', name: 'Physics', icon: '⚛️', tagline: 'Physics Laboratory', color: '#4fe3d0', levels: ['school', 'college'], route: '/world/physics' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', tagline: 'Chemistry Laboratory', color: '#ff6ec7', levels: ['school', 'college'], route: '/world/chemistry' },
  { id: 'biology', name: 'Biology', icon: '🧬', tagline: 'Biology Exploration Zone', color: '#66ffa3', levels: ['school', 'college'], route: '/world/biology' },
  { id: 'cs', name: 'Computer Science', icon: '💻', tagline: 'Computer Science World', color: '#8b7cff', levels: ['school', 'college'], route: '/world/cs' },
  { id: 'history', name: 'History', icon: '🏛', tagline: 'History Portal', color: '#ffb454', levels: ['school', 'college'], route: '/world/history' },
  { id: 'geography', name: 'Geography', icon: '🌍', tagline: 'Geography World', color: '#4fe3d0', levels: ['school', 'college'], route: '/world/geography' },
]

// There are only 7 hand-built 3D worlds, but 90+ possible curriculum subjects
// across every stream/year. Every subject name that can appear in onboarding
// (school subjects + every COLLEGE_CURRICULUM entry + the flat fallback list)
// maps to whichever existing world is the closest conceptual fit, so a
// Biotechnology or Civil Engineering student sees a hub built around THEIR
// subjects instead of always the same generic 7 planets.
const SUBJECT_TO_WORLD: Record<string, string> = {
  // School subjects
  Mathematics: 'math', Physics: 'physics', Chemistry: 'chemistry', Biology: 'biology',
  'Computer Science': 'cs', History: 'history', Geography: 'geography', English: 'history',
  // Computer Science / Information Technology
  'Programming Fundamentals': 'cs', 'Digital Logic Design': 'cs', 'Data Structures': 'cs',
  Algorithms: 'cs', 'Database Systems': 'cs', 'Discrete Mathematics': 'math', 'Computer Organization': 'cs',
  'Operating Systems': 'cs', 'Computer Networks': 'cs', 'Software Engineering': 'cs',
  'Theory of Computation': 'cs', 'Artificial Intelligence': 'cs', 'Machine Learning': 'cs',
  'Cloud Computing': 'cs', 'Distributed Systems': 'cs', Cybersecurity: 'cs', 'Capstone Project': 'cs',
  'Web Technologies': 'cs', 'Object-Oriented Programming': 'cs', 'Information Security': 'cs',
  'Mobile App Development': 'cs', 'DevOps & System Administration': 'cs', 'Data Analytics': 'math', 'Enterprise Systems': 'cs',
  // Electronics & Communication
  'Circuit Theory': 'physics', 'Electronic Devices': 'physics', 'Signals & Systems': 'physics',
  'Analog Electronics': 'physics', 'Digital Electronics': 'cs', Microprocessors: 'cs',
  'Communication Systems': 'physics', 'Control Systems': 'physics', 'VLSI Design': 'cs',
  'Electromagnetic Theory': 'physics', 'Embedded Systems': 'cs', 'Wireless Communication': 'physics',
  'IoT Systems': 'cs', 'Signal Processing': 'math',
  // Mechanical Engineering
  'Engineering Graphics': 'math', Thermodynamics: 'physics', 'Mechanics of Materials': 'physics',
  'Fluid Mechanics': 'physics', 'Manufacturing Processes': 'chemistry', 'Material Science': 'chemistry',
  'Machine Design': 'physics', 'Heat Transfer': 'physics', 'Kinematics of Machines': 'physics',
  'CAD/CAM': 'cs', 'Industrial Engineering': 'math', Robotics: 'cs', 'Automotive Engineering': 'physics',
  'Thermal Power Systems': 'physics', Mechatronics: 'cs',
  // Civil Engineering
  'Structural Analysis': 'physics', Surveying: 'math', 'Building Materials': 'chemistry',
  'Geotechnical Engineering': 'geography', 'Concrete Technology': 'chemistry', 'Transportation Engineering': 'geography',
  'Environmental Engineering': 'geography', 'Steel Structures': 'physics', Hydrology: 'geography',
  'Earthquake Engineering': 'geography', 'Construction Management': 'math', 'Urban Planning': 'geography',
  'Foundation Engineering': 'physics',
  // Biotechnology
  'Cell Biology': 'biology', Genetics: 'biology', Biochemistry: 'chemistry', Microbiology: 'biology',
  'Molecular Biology': 'biology', 'Genetic Engineering': 'biology', 'Bioprocess Technology': 'chemistry',
  Immunology: 'biology', Bioinformatics: 'cs', 'Plant Biotechnology': 'biology', 'Animal Biotechnology': 'biology',
  'Pharmaceutical Biotechnology': 'chemistry', 'Bioethics & Regulation': 'history', Genomics: 'biology',
  // Business Administration
  'Principles of Economics': 'math', 'Financial Accounting': 'math', 'Business Communication': 'history',
  'Marketing Management': 'history', 'Organizational Behavior': 'history', 'Corporate Finance': 'math',
  'Business Statistics': 'math', Microeconomics: 'math', 'Operations Management': 'math',
  'Human Resource Management': 'history', 'Strategic Management': 'history', 'Business Law': 'history',
  Macroeconomics: 'math', Entrepreneurship: 'history', 'International Business': 'geography',
  'Investment Analysis': 'math', 'Digital Marketing': 'cs',
  // Mathematics stream
  Calculus: 'math', 'Linear Algebra': 'math', 'Real Analysis': 'math', 'Abstract Algebra': 'math',
  'Differential Equations': 'math', 'Probability Theory': 'math', 'Complex Analysis': 'math',
  'Numerical Methods': 'math', Topology: 'math', Statistics: 'math', 'Graph Theory': 'math',
  'Functional Analysis': 'math', 'Mathematical Modeling': 'math', Cryptography: 'cs', 'Optimization Theory': 'math',
  // Physics stream
  Mechanics: 'physics', Electromagnetism: 'physics', 'Waves & Optics': 'physics', 'Mathematical Physics': 'math',
  'Modern Physics': 'physics', 'Quantum Mechanics': 'physics', 'Statistical Mechanics': 'physics',
  'Solid State Physics': 'physics', 'Nuclear Physics': 'physics', 'Classical Mechanics': 'physics',
  'Particle Physics': 'physics', Astrophysics: 'physics', 'Condensed Matter Physics': 'physics',
  'Computational Physics': 'cs',
  // Flat fallback list (COLLEGE_SUBJECTS / "Other")
  Programming: 'cs', 'Engineering Subjects': 'physics',
}

// Returns only the worlds relevant to what the student actually picked in
// onboarding — falls back to every world for their level if nothing maps
// (e.g. onboarding not completed yet).
export function worldsForSubjects(subjects: string[], level: 'school' | 'college'): SubjectDef[] {
  const levelWorlds = SUBJECT_WORLDS.filter((w) => w.levels.includes(level))
  const mappedIds = new Set(subjects.map((s) => SUBJECT_TO_WORLD[s]).filter(Boolean))
  if (mappedIds.size === 0) return levelWorlds
  return levelWorlds.filter((w) => mappedIds.has(w.id))
}

// The reverse of worldsForSubjects: given a world id, which of the student's
// *actual* onboarding picks (e.g. "Structural Analysis", "Bioinformatics")
// land on it — used to label a planet's moons with the student's real
// syllabus subjects instead of a generic topic list.
export function subjectsForWorld(worldId: string, subjects: string[]): string[] {
  return subjects.filter((s) => SUBJECT_TO_WORLD[s] === worldId)
}

export interface HubPlanet extends SubjectDef {
  // Display name of the underlying 3D world this planet routes into (e.g.
  // "Physics") — distinct from `name`, which is the student's actual subject
  // (e.g. "Steel Structures"). Used to pull world-relevant moon topics.
  worldName: string
}

// One planet per subject the student actually picked (not per world) — so a
// Mechanical Engineering Year 2 student with 5 subjects sees 5 planets, even
// though several of them route into the same underlying Physics/Chemistry
// world page. Falls back to one planet per world when nothing's picked yet.
export function planetsForSubjects(subjects: string[], level: 'school' | 'college'): HubPlanet[] {
  const levelWorlds = SUBJECT_WORLDS.filter((w) => w.levels.includes(level))
  const seen = new Set<string>()
  const planets: HubPlanet[] = []
  for (const s of subjects) {
    const worldId = SUBJECT_TO_WORLD[s]
    if (!worldId || seen.has(s)) continue
    const w = levelWorlds.find((x) => x.id === worldId)
    if (!w) continue
    seen.add(s)
    planets.push({ ...w, id: s, name: s, worldName: w.name })
  }
  if (planets.length === 0) {
    return levelWorlds.map((w) => ({ ...w, worldName: w.name }))
  }
  return planets
}

export interface RecommendedVideo {
  id: string
  title: string
  channel: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  subject: string
  reason: string
  youtubeId: string
  topic: string
  levelHint: 'Grade 6-8' | 'Grade 9-10' | 'Grade 11-12' | 'College'
}

// Real, publicly embeddable YouTube videos — thumbnails load straight from
// YouTube's public thumbnail CDN (no API key needed), and cards open a
// lightweight modal player rather than faking a "watch" experience.
export const VIDEO_POOL: RecommendedVideo[] = [
  {
    id: 'v1',
    title: 'Recursion in 100 Seconds',
    channel: 'Fireship',
    duration: '2 min',
    difficulty: 'Intermediate',
    subject: 'Computer Science',
    reason: 'Recommended because you frequently revisit recursive algorithms.',
    youtubeId: 'rf60MejMz3E',
    topic: 'Recursion',
    levelHint: 'College',
  },
  {
    id: 'v2',
    title: 'Breadth-First Search, Visualized',
    channel: 'Inside code',
    duration: '9 min',
    difficulty: 'Beginner',
    subject: 'Computer Science',
    reason: 'You learn more effectively through short visual simulations.',
    youtubeId: 'mVzsz8Actrc',
    topic: 'Graphs',
    levelHint: 'College',
  },
  {
    id: 'v3',
    title: 'Introduction to Graph Data Structures',
    duration: '12 min',
    channel: 'CS Dojo',
    difficulty: 'Beginner',
    subject: 'Computer Science',
    reason: 'Graphs is a weak area — starting with the fundamentals first.',
    youtubeId: 'bUnq_lvvFcE',
    topic: 'Graphs',
    levelHint: 'College',
  },
  {
    id: 'v4',
    title: 'Vectors, What Even Are They?',
    channel: '3Blue1Brown',
    duration: '9 min',
    difficulty: 'Intermediate',
    subject: 'Mathematics',
    reason: 'Matches your visual + interactive learning style.',
    youtubeId: 'fNk_zzaMoSs',
    topic: 'Vectors & Linear Algebra',
    levelHint: 'Grade 11-12',
  },
  {
    id: 'v5',
    title: "Newton's 3 Laws of Motion, Animated",
    channel: 'Physics Girl',
    duration: '6 min',
    difficulty: 'Beginner',
    subject: 'Physics',
    reason: 'You completed 92% of similar short physics videos.',
    youtubeId: 'jW8zuoRk9a8',
    topic: 'Mechanics',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v6',
    title: 'Dynamic Programming — Introduction',
    channel: 'NeetCode',
    duration: '11 min',
    difficulty: 'Advanced',
    subject: 'Computer Science',
    reason: 'Prerequisite for your upcoming DP module.',
    youtubeId: 'nqowUJzG-iM',
    topic: 'Dynamic Programming',
    levelHint: 'College',
  },
  {
    id: 'v7',
    title: 'Visualization and Comparison of Sorting Algorithms',
    channel: 'timo bingmann',
    duration: '10 min',
    difficulty: 'Beginner',
    subject: 'Computer Science',
    reason: 'You just practiced sorting — see every algorithm side by side.',
    youtubeId: 'ZZuD6iUe3Pc',
    topic: 'Sorting Algorithms',
    levelHint: 'College',
  },
  {
    id: 'v8',
    title: 'The Periodic Table',
    channel: 'Khan Academy',
    duration: '9 min',
    difficulty: 'Beginner',
    subject: 'Chemistry',
    reason: 'A solid foundation before combining elements in the lab.',
    youtubeId: 'CtTmUlp3bBo',
    topic: 'Periodic Table',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v9',
    title: 'Atomic Hook-Ups: Types of Chemical Bonds',
    channel: 'Crash Course',
    duration: '11 min',
    difficulty: 'Intermediate',
    subject: 'Chemistry',
    reason: 'Explains ionic vs covalent bonding — exactly what the lab simulates.',
    youtubeId: 'QXT4OVM4vXI',
    topic: 'Chemical Bonding',
    levelHint: 'Grade 11-12',
  },
  {
    id: 'v10',
    title: 'DNA Structure and Replication',
    channel: 'Crash Course',
    duration: '12 min',
    difficulty: 'Beginner',
    subject: 'Biology',
    reason: 'Popular starting point before exploring cells and genetics.',
    youtubeId: '8kK2zwjRV0M',
    topic: 'Genetics',
    levelHint: 'Grade 11-12',
  },
  {
    id: 'v11',
    title: 'How the Human Heart & Circulatory System Works',
    channel: '3D Medical Animation',
    duration: '8 min',
    difficulty: 'Beginner',
    subject: 'Biology',
    reason: 'Matches the interactive heart model in your Biology zone.',
    youtubeId: 'CR3dEqbQzfo',
    topic: 'Human Body Systems',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v12',
    title: 'How World War I Started',
    channel: 'Crash Course',
    duration: '13 min',
    difficulty: 'Intermediate',
    subject: 'History',
    reason: 'Deep dive into the era you were exploring in the History Portal.',
    youtubeId: 'Cd2ch4XV84s',
    topic: 'Modern History',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v13',
    title: 'The Plate Tectonics Revolution',
    channel: 'Crash Course Geography',
    duration: '11 min',
    difficulty: 'Intermediate',
    subject: 'Geography',
    reason: 'Explains why earthquakes and volcanoes cluster where they do.',
    youtubeId: '7CPv0NSIG2M',
    topic: 'Physical Geography',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v14',
    title: 'SQL Explained in 100 Seconds',
    channel: 'Fireship',
    duration: '2 min',
    difficulty: 'Beginner',
    subject: 'Computer Science',
    reason: 'Quick primer before the Database Center module.',
    youtubeId: 'zsjvFFKOm3c',
    topic: 'Database Systems',
    levelHint: 'College',
  },
  {
    id: 'v15',
    title: 'What is an Operating System?',
    channel: 'Beginner Tech',
    duration: '10 min',
    difficulty: 'Beginner',
    subject: 'Computer Science',
    reason: 'Core concept for your Operating Systems coursework.',
    youtubeId: 'ki0Vmag51zo',
    topic: 'Operating Systems',
    levelHint: 'College',
  },
  {
    id: 'v16',
    title: 'Machine Learning Explained in 100 Seconds',
    channel: 'Fireship',
    duration: '2 min',
    difficulty: 'Beginner',
    subject: 'Computer Science',
    reason: 'A fast on-ramp before your Machine Learning module.',
    youtubeId: 'PeMlggyqz0Y',
    topic: 'Machine Learning',
    levelHint: 'College',
  },
  {
    id: 'v17',
    title: 'The Essence of Calculus, Chapter 1',
    channel: '3Blue1Brown',
    duration: '17 min',
    difficulty: 'Intermediate',
    subject: 'Mathematics',
    reason: "Builds real intuition — matches your visual learning style.",
    youtubeId: 'WUvTyaaNkzM',
    topic: 'Calculus',
    levelHint: 'Grade 11-12',
  },
  {
    id: 'v18',
    title: 'Variables, Expressions, and Equations | Intro to Algebra',
    channel: 'Khan Academy',
    duration: '6 min',
    difficulty: 'Beginner',
    subject: 'Mathematics',
    reason: 'Foundational algebra — the on-ramp for every equation you\'ll meet later.',
    youtubeId: 'vDqOoI-4Z6M',
    topic: 'Algebra Basics',
    levelHint: 'Grade 6-8',
  },
  {
    id: 'v19',
    title: 'The Pythagorean Theorem, Intro',
    channel: 'Khan Academy',
    duration: '5 min',
    difficulty: 'Beginner',
    subject: 'Mathematics',
    reason: 'Sets up right-triangle trigonometry before you go further.',
    youtubeId: 'AA6RfgP-AHU',
    topic: 'Geometry & Trigonometry',
    levelHint: 'Grade 6-8',
  },
  {
    id: 'v20',
    title: 'Statistics — Mean, Median, Mode, Range',
    channel: 'Stan Lisle',
    duration: '7 min',
    difficulty: 'Beginner',
    subject: 'Mathematics',
    reason: 'Core data-handling skills used throughout middle-school math.',
    youtubeId: 'HPPO73_LCYc',
    topic: 'Statistics',
    levelHint: 'Grade 6-8',
  },
  {
    id: 'v21',
    title: 'The Water Cycle',
    channel: 'Khan Academy',
    duration: '5 min',
    difficulty: 'Beginner',
    subject: 'Geography',
    reason: 'A classic early-grade earth-science topic, visualized simply.',
    youtubeId: 'jFjI6y46QRk',
    topic: 'Earth Science',
    levelHint: 'Grade 6-8',
  },
  {
    id: 'v22',
    title: 'Photosynthesis: Crash Course Biology #8',
    channel: 'CrashCourse',
    duration: '13 min',
    difficulty: 'Intermediate',
    subject: 'Biology',
    reason: 'The core plant-biology process behind most food-chain questions.',
    youtubeId: 'sQK3Yr4Sc_k',
    topic: 'Plant Biology',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v23',
    title: 'Mitosis: Splitting Up is Complicated — Crash Course Biology #12',
    channel: 'CrashCourse',
    duration: '10 min',
    difficulty: 'Intermediate',
    subject: 'Biology',
    reason: 'Cell division is a recurring topic across grade 10-12 biology.',
    youtubeId: 'L0k-enzoeOM',
    topic: 'Cell Division',
    levelHint: 'Grade 11-12',
  },
  {
    id: 'v24',
    title: 'Introduction to Nouns | The Parts of Speech',
    channel: 'Khan Academy',
    duration: '4 min',
    difficulty: 'Beginner',
    subject: 'English',
    reason: 'Grammar fundamentals every grade builds on.',
    youtubeId: 'UejW-WQpujs',
    topic: 'Grammar',
    levelHint: 'Grade 6-8',
  },
  {
    id: 'v25',
    title: 'The Renaissance: Was it a Thing? — Crash Course World History #22',
    channel: 'CrashCourse',
    duration: '11 min',
    difficulty: 'Intermediate',
    subject: 'History',
    reason: 'A pivotal era that shows up across grade 9-12 world history.',
    youtubeId: 'Vufba_ZcoR0',
    topic: 'World History',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v26',
    title: 'Computer Networking in 100 Seconds',
    channel: 'Fireship',
    duration: '2 min',
    difficulty: 'Beginner',
    subject: 'Computer Science',
    reason: 'A fast primer before your Computer Networks coursework.',
    youtubeId: 'keeqnciDVOo',
    topic: 'Computer Networks',
    levelHint: 'College',
  },
  {
    id: 'v27',
    title: 'But What Is a Neural Network? | Deep Learning, Chapter 1',
    channel: '3Blue1Brown',
    duration: '19 min',
    difficulty: 'Advanced',
    subject: 'Computer Science',
    reason: 'The visual intuition behind every ML model you\'ll build later.',
    youtubeId: 'aircAruvnKk',
    topic: 'Machine Learning',
    levelHint: 'College',
  },
  {
    id: 'v28',
    title: 'The Cold War: Crash Course US History #37',
    channel: 'CrashCourse',
    duration: '13 min',
    difficulty: 'Intermediate',
    subject: 'History',
    reason: 'A major 20th-century era that shows up throughout grade 9-12 history.',
    youtubeId: '9C72ISMF_D0',
    topic: 'Modern History',
    levelHint: 'Grade 11-12',
  },
  {
    id: 'v29',
    title: 'What Is Organic Chemistry? — Crash Course Organic Chemistry #1',
    channel: 'CrashCourse',
    duration: '12 min',
    difficulty: 'Advanced',
    subject: 'Chemistry',
    reason: 'The gateway topic for every advanced chemistry course, school or college.',
    youtubeId: 'PmvLB5dIEp8',
    topic: 'Organic Chemistry',
    levelHint: 'College',
  },
  {
    id: 'v30',
    title: 'How Do We Classify Climates? — Crash Course Geography #13',
    channel: 'CrashCourse',
    duration: '11 min',
    difficulty: 'Intermediate',
    subject: 'Geography',
    reason: 'Builds on climate zones — a core physical-geography topic.',
    youtubeId: 'xiGhLGFkJjo',
    topic: 'Climate',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v31',
    title: 'Electric Current — Crash Course Physics #28',
    channel: 'CrashCourse',
    duration: '10 min',
    difficulty: 'Intermediate',
    subject: 'Physics',
    reason: 'Electricity and circuits are core to every physics syllabus.',
    youtubeId: 'HXOok3mfMLM',
    topic: 'Electricity & Circuits',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v32',
    title: 'Ecosystem Ecology: Links in the Chain — Crash Course Ecology #7',
    channel: 'CrashCourse',
    duration: '11 min',
    difficulty: 'Intermediate',
    subject: 'Biology',
    reason: 'Food webs and energy flow are a recurring topic across biology grades.',
    youtubeId: 'v6ubvEJ3KGM',
    topic: 'Ecology',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v33',
    title: 'Introduction to the Quadratic Equation',
    channel: 'Khan Academy',
    duration: '9 min',
    difficulty: 'Intermediate',
    subject: 'Mathematics',
    reason: 'A core Algebra I topic that keeps reappearing through high school math.',
    youtubeId: 'IWigvJcCAJ0',
    topic: 'Algebra Basics',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v34',
    title: 'Perimeter and Area: The Basics',
    channel: 'Khan Academy',
    duration: '6 min',
    difficulty: 'Beginner',
    subject: 'Mathematics',
    reason: 'The geometry foundation used throughout middle-school math.',
    youtubeId: 'LoaBd-sPzkU',
    topic: 'Geometry & Trigonometry',
    levelHint: 'Grade 6-8',
  },
  {
    id: 'v35',
    title: 'Simple Harmonic Motion — Crash Course Physics #16',
    channel: 'CrashCourse',
    duration: '10 min',
    difficulty: 'Advanced',
    subject: 'Physics',
    reason: 'Explains oscillation and springs — a recurring high-school and college topic.',
    youtubeId: 'jxstE6A_CYQ',
    topic: 'Mechanics',
    levelHint: 'Grade 11-12',
  },
  {
    id: 'v36',
    title: 'The First & Zeroth Laws of Thermodynamics — Crash Course Engineering #9',
    channel: 'CrashCourse',
    duration: '11 min',
    difficulty: 'Advanced',
    subject: 'Physics',
    reason: 'Core to Mechanical Engineering coursework and college-level physics.',
    youtubeId: 'fSEFfWf2au0',
    topic: 'Thermodynamics',
    levelHint: 'College',
  },
  {
    id: 'v37',
    title: 'Intro to Acids and Bases',
    channel: 'Khan Academy',
    duration: '8 min',
    difficulty: 'Intermediate',
    subject: 'Chemistry',
    reason: 'A foundational reactions topic tested across every chemistry syllabus.',
    youtubeId: 'ja7p_tzTTEA',
    topic: 'Reactions',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v38',
    title: 'Natural Selection — Crash Course Biology #14',
    channel: 'CrashCourse',
    duration: '11 min',
    difficulty: 'Intermediate',
    subject: 'Biology',
    reason: 'The core mechanism behind evolution — a staple of grade 10-12 biology.',
    youtubeId: 'aTftyFboC_M',
    topic: 'Evolution',
    levelHint: 'Grade 11-12',
  },
  {
    id: 'v39',
    title: 'Lower Respiratory System',
    channel: 'Khan Academy',
    duration: '7 min',
    difficulty: 'Beginner',
    subject: 'Biology',
    reason: 'Human body systems are a recurring topic across biology grades.',
    youtubeId: 'yhazrPw8nLg',
    topic: 'Human Body Systems',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v40',
    title: 'The Roman Empire. Or Republic. Or...Which Was It? — Crash Course World History #10',
    channel: 'CrashCourse',
    duration: '12 min',
    difficulty: 'Intermediate',
    subject: 'History',
    reason: 'A foundational ancient-civilizations topic across grade 6-10 history.',
    youtubeId: 'oPf27gAup9U',
    topic: 'Ancient Civilizations',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v41',
    title: 'How Rivers Shape the Landscape — Crash Course Geography #23',
    channel: 'CrashCourse',
    duration: '11 min',
    difficulty: 'Intermediate',
    subject: 'Geography',
    reason: 'A core physical-geography process behind landform questions.',
    youtubeId: 'CDEj62HGNkk',
    topic: 'Physical Geography',
    levelHint: 'Grade 9-10',
  },
  {
    id: 'v42',
    title: 'Cybersecurity in 100 Seconds',
    channel: 'Grant Collins',
    duration: '2 min',
    difficulty: 'Beginner',
    subject: 'Computer Science',
    reason: 'A fast primer before your Cybersecurity coursework.',
    youtubeId: '9iyR0YhzAis',
    topic: 'Cybersecurity',
    levelHint: 'College',
  },
]
