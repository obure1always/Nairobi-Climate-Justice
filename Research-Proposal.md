Designing and Evaluating a Mobile-First Progressive Web 
Application 
to Support Climate Adaptation Literacy and Climate Justice 
Awareness 
Among Youth in Kibera and Ruaraka, Nairobi 
BSc. in Software Engineering 
John Obure 
Supervisor 
Junior Turatsinze 
Date: 
September 10, 2026 
Declaration 
I, John Obure, declare that this research proposal titled "Designing and Evaluating 
a Mobile-First Progressive Web Application to Support Climate Adaptation Literacy and 
Climate Justice Awareness Among Youth in Kibera and Ruaraka, Nairobi" is my original 
work. It has not been submitted for examination at another institution or for another award. 
All sources used in developing the proposal are acknowledged in the text and reference 
list. 
John Obure Research Proposal    |    ii 
 
Table of Contents 
Declaration...................................................................................................................................... ii 
List of Tables................................................................................................................................... v 
List of Figures................................................................................................................................. vi 
List of Acronyms and Abbreviations............................................................................................... vii 
CHAPTER ONE INTRODUCTION.......................................................................................... 1 
1.1 Background to the Study.................................................................................................... 1 
1.2 Statement of the Problem................................................................................................... 2 
1.3 Aim and Objectives of the Study....................................................................................... 3 
1.3.1 Specific Objectives.................................................................................................. 3 
1.4 Research Questions............................................................................................................ 4 
1.5 Project Scope...................................................................................................................... 4 
1.6 Significance and Justification............................................................................................. 5 
1.7 Research Budget................................................................................................................. 5 
1.8 Research Timeline.............................................................................................................. 6 
1.9 Definition of Terms............................................................................................................ 6 
CHAPTER TWO LITERATURE REVIEW............................................................................. 8 
2.1 Introduction........................................................................................................................ 8 
2.2 Conceptual Review............................................................................................................ 8 
2.3 Historical Background of the Research Topic.................................................................... 9 
2.3.1 Origins and Early Context....................................................................................... 9 
2.3.2 Key Milestones........................................................................................................ 10 
John Obure Research Proposal    |    iii 
 
2.3.3 Historical Gaps and Transition to the Current Study............................................... 10 
2.4 Theoretical Review............................................................................................................ 10 
2.4.1 Foundational Theories............................................................................................. 10 
2.5 Overview of Existing Systems........................................................................................... 11 
2.5.1 Strengths and Weaknesses of Existing Systems...................................................... 12 
2.6 Review of Related Works................................................................................................... 12 
2.6.1 Summary of Reviewed Literature............................................................................ 13 
2.7 General Comments............................................................................................................ 14 
CHAPTER THREE SYSTEM ANALYSIS AND DESIGN...................................................... 15 
3.1 Introduction........................................................................................................................ 15 
3.2 Research Design................................................................................................................. 15 
3.2.1 Study Population and Sampling............................................................................... 16 
3.2.2 Data Collection and Analysis.................................................................................. 16 
3.2.3 Software Development Life Cycle........................................................................... 17 
3.2.4 Metrics for Evaluation............................................................................................. 17 
3.3 System Analysis................................................................................................................. 18 
3.3.1 Functional Requirements of the System.................................................................. 18 
3.3.2 Non Functional Requirements of the System.......................................................... 19 
3.3.3 Proposed Model Diagram........................................................................................ 20 
3.4 System Design.................................................................................................................... 20 
3.5 Development Tools............................................................................................................ 26 
3.6 Ethical Considerations....................................................................................................... 27 
References...................................................................................................................................... 29 
John Obure Research Proposal    |    iv 
 
List of Tables 
Table 1.1 Estimated research budget............................................................................................... 5 
Table 2.1 Comparison of existing software systems........................................................................ 12 
Table 2.2 Summary of empirical literature..................................................................................... 13 
Table 3.1 Objective, research question, and evidence alignment.................................................... 15 
Table 3.2 Evaluation metrics and decision rules............................................................................. 17 
Table 3.3 Functional requirements.................................................................................................. 18 
Table 3.4 Non functional requirements........................................................................................... 19 
Table 3.5 Development tools and rationale..................................................................................... 26 
John Obure Research Proposal    |    v 
 
List of Figures 
Figure 1.1 Research and development timeline............................................................................... 6 
Figure 2.1 Conceptual framework................................................................................................... 9 
Figure 3.1 Mission aligned design and evaluation model................................................................ 20 
Figure 3.2 Progressive web application architecture....................................................................... 21 
Figure 3.3 System use case diagram................................................................................................ 22 
Figure 3.4 Relational data model..................................................................................................... 23 
Figure 3.5 Back end class diagram.................................................................................................. 24 
Figure 3.6 Participant activity flow................................................................................................. 25 
Figure 3.7 Offline synchronisation sequence................................................................................... 26 
John Obure Research Proposal    |    vi 
 
List of Acronyms and Abbreviations 
Acronym Meaning 
ALU African Leadership University 
API Application Programming Interface 
CBO Community Based Organisation 
CCDRM Children's Climate and Disaster Risk Model 
CO2 Carbon Dioxide 
FGD Focus Group Discussion 
GHG Greenhouse Gas 
HTTPS Hypertext Transfer Protocol Secure 
IPCC Intergovernmental Panel on Climate Change 
JWT JSON Web Token 
NCCAP National Climate Change Action Plan 
PWA Progressive Web Application 
REST Representational State Transfer 
SDLC Software Development Life Cycle 
SUS System Usability Scale 
TAM Technology Acceptance Model 
UNESCO United Nations Educational Scientific and 
Cultural Organization 
UNICEF United Nations Children's Fund 
WCAG Web Content Accessibility Guidelines 
WMO World Meteorological Organization 
 
John Obure Research Proposal    |    vii 
CHAPTER ONE 
INTRODUCTION 
1.1 Background to the Study 
Climate change is already altering livelihoods, public health, infrastructure, water 
security, and food systems across Africa. The continent has contributed a small share of 
cumulative greenhouse gas emissions yet faces severe exposure and limited adaptation 
finance and infrastructure. The Intergovernmental Panel on Climate Change reports a 34 
percent reduction in Africa's agricultural productivity growth since 1961. No other region 
recorded a larger reduction (IPCC, 2022). The causes, impacts, and capacity to respond are 
distributed unequally. Climate change is therefore an educational and justice issue, as well 
as an environmental one. 
Kenya's recent climate record makes the problem immediate. The Kenya 
Meteorological Department reported that 2023 was then the warmest year in the national 
record. Floods affected more than 750,000 people. Its subsequent report identified 2024 as 
the country's hottest year on record (Kenya Meteorological Department, 2024, 2025). 
Nairobi's informal settlements face recurring flood exposure, drainage failures, water 
contamination, unsafe housing, and livelihood disruption. Research in Kibera and Mathare 
documents wide effects on daily life. These include harm to health, household finances, 
food and water access, and neighbourhood safety (Balakrishnan et al., 2024). A survey of 
963 Kibera households reached a similar conclusion. Effective flood adaptation requires 
community participation, household action, public infrastructure, and supportive policy 
(Mulligan et al., 2017). 
Young people need practical knowledge that connects these local hazards with 
adaptation choices and with the unequal distribution of climate responsibility. UNESCO's 
global youth survey found major knowledge gaps. Seventy percent of respondents could 
explain only broad principles, could not explain climate change, or knew nothing about it 
(UNESCO, 2022). Kenya also has a strong base for mobile delivery. By December 2024, 
the country had 44.8 million mobile broadband subscriptions and 41.5 million smartphones 
(Communications Authority of Kenya, 2025). These national figures do not prove equal 
access in Kibera or Ruaraka. However, they support a mobile first approach that uses little 
data and works during connectivity gaps. 
John Obure Research Proposal    |    1 
Traditional climate education is commonly delivered through classroom lessons, 
printed materials, public campaigns, or short workshops. These approaches can provide 
trusted information and direct discussion. However, learners may struggle to revisit the 
material later. The content may also overlook risks within a specific neighbourhood. 
Existing digital systems improve reach. ClimateScience provides short courses and 
quizzes. Earth Hero combines a carbon calculator with suggested actions. NASA Climate 
Kids explains climate science through games and multimedia. These systems focus on 
global science, personal emissions, or younger learners. They do not provide bilingual, 
Nairobi specific education on adaptation and climate justice (ClimateScience, 2024; Earth 
Hero, 2025; NASA, 2026). 
This proposal investigates an offline capable Progressive Web Application. It will 
provide short modules in English and Kiswahili. Topics include flooding, heat, water 
stress, climate sensitive disease, unequal emissions, accountability, and safe civic 
participation. The software is not intended to forecast weather, replace formal teaching, or 
conduct campaigns. Its purpose is to make verified local knowledge easier to access and to 
measure short term learning. The pilot will also test whether the design is usable enough 
for further development. 
1.2 Statement of the Problem 
Nairobi youth face several climate hazards. Yet many lack practical local guidance 
on how to prepare for and respond to them. Extreme weather affects health, income, water 
access, mobility, and education in informal settlements, while general climate curricula 
may stop at definitions and mitigation. UNESCO found weak climate understanding 
among young people. Evidence from Nairobi also shows that extreme weather disrupts 
several parts of daily life. Together, these findings show a measurable educational gap 
(Balakrishnan et al., 2024; UNESCO, 2022). 
Available software does not adequately combine three requirements of this setting: 
Nairobi specific adaptation, climate justice literacy, and reliable use under intermittent 
connectivity. ClimateScience offers structured courses. Earth Hero focuses on personal 
footprints and action tracking. NASA Climate Kids targets younger learners. The Kenya 
Meteorological Department provides forecasts and reports, but no guided learning pathway 
for youth. None of these systems combines bilingual learning, offline access, adaptation 
knowledge, and justice awareness for Nairobi youth. The proposed pilot will test that 
John Obure Research Proposal    |    2 
combination (ClimateScience, 2024; Earth Hero, 2025; Kenya Meteorological Department, 
2024; NASA, 2026). 
This study introduces a mobile first Progressive Web Application. It will offer 
reviewed English and Kiswahili modules, offline lessons, low bandwidth media, quizzes, 
progress tracking, and verified civic resources. The application will be piloted with 
approximately 50 youth aged 15 to 24 in Kibera and Ruaraka. The evaluation will use a 
one group pretest and posttest design. A usability survey, usage records, and focus group 
feedback will assess engagement, advocacy self efficacy, and the user experience. The pilot 
will not establish population wide effects or prove causality. It will test feasibility and 
determine whether a larger controlled study is justified. 
1.3 Aim and Objectives of the Study 
This study aims to design, develop, and evaluate an offline capable mobile first web 
application. The application will give Nairobi youth access to locally relevant climate 
adaptation and climate justice education. 
1.3.1 Specific Objectives 
SO1.  To identify the climate adaptation information needs and climate justice 
knowledge gaps of youth aged 15 to 24 in Kibera and Ruaraka. 
SO2.  To determine the connectivity constraints, language needs, and content 
preferences that should guide the application. 
SO3.  To design and develop a bilingual, offline capable Progressive Web Application 
with reviewed Nairobi specific modules, quizzes, progress tracking, and verified 
resources. 
SO4.  To measure short term changes in adaptation literacy, climate justice awareness, 
and advocacy self efficacy during the pilot. 
SO5.  To assess usability, engagement, module completion, offline synchronisation 
reliability, and participant feedback. 
1.4 Research Questions 
RQ1.  What climate adaptation information needs and climate justice knowledge gaps 
exist among youth in Kibera and Ruaraka? 
John Obure Research Proposal    |    3 
RQ2.  What connectivity constraints, language needs, and content preferences should 
guide the application design? 
RQ3.  How can a bilingual, offline capable Progressive Web Application deliver locally 
relevant adaptation and climate justice education? 
RQ4.  What short term changes in adaptation literacy, climate justice awareness, and 
advocacy self efficacy are observed during the pilot? 
RQ5.  What levels of usability, engagement, module completion, offline reliability, and 
participant satisfaction are observed during the pilot? 
1.5 Project Scope 
Geographical scope. The pilot is limited to Kibera and Ruaraka in Nairobi County. 
The two locations provide different urban contexts but are not statistically representative of 
Nairobi or Kenya. 
Population scope. The target group is approximately 50 youth aged 15 to 24, with 
an intended balance of about 25 participants per location. Recruitment will seek variation 
in gender and education status through cooperating community organisations or 
educational institutions. 
Content scope. The initial release will contain seven core modules. The first four 
cover Nairobi climate risk, urban flooding, heat and health, and water stress and disease 
prevention. The remaining modules cover climate justice, green claims, and safe civic 
participation. 
Technical scope. The deliverable is a responsive Progressive Web Application for 
modern mobile and desktop browsers. Core lessons and saved progress will work offline 
after first access. The pilot will not include native Android or iOS applications. It will also 
exclude real time forecasts, artificial intelligence recommendations, financial transactions, 
open social networking, petitions, and campaign tools. 
Research scope. The evaluation measures immediate and short term outcomes 
during a sixteen week project. It does not measure long term behaviour, community 
resilience, reduced disaster losses, or policy change. 
John Obure Research Proposal    |    4 
1.6 Significance and Justification 
The project will give participants reusable guidance on Nairobi specific adaptation 
and climate justice. They can access the material by phone and revisit it without 
continuous connectivity. Its bilingual, low bandwidth design addresses practical access 
barriers instead of assuming stable data and high end devices. 
The study will produce evidence beyond software performance. Pretest and posttest 
results will measure changes in adaptation and justice knowledge. Usability, completion, 
and qualitative feedback will show whether participants can and want to use the product. 
This evidence will identify which content and design decisions deserve further investment. 
The work also offers a replicable technical and evaluation model for community 
organisations and educators. Any decision to scale will depend on the pilot findings, 
independent content review, and safeguarding requirements. A larger study must also 
estimate the effects more credibly. 
1.7 Research Budget 
Table 1.1 Estimated research budget in Kenyan shillings 
Item 
Basis 
Quantity 
Local transport 
Eight field visits 
across the two pilot 
locations 
8 visits 
Unit cost KES 
1,000 
Total KES 
8,000 
Mobile data 
Consent materials 
Pilot refreshments 
Contingency 
Total 
Development 
testing and pilot 
coordination 
Participant 
information 
consent and assent 
forms 
Two group sessions 
of approximately 
25 participants 
Approximately 10 
percent of direct 
field costs 
Estimated cash 
requirement   
4 months 
120 copies 
50 people 
1 
2,000 
20 
200 
2,840 
8,000 
2,400 
10,000 
2,840 
31,240 
John Obure Research Proposal    |    5 
The figures are planning estimates and should be confirmed before procurement. 
The student's laptop, development software, design tools, and pilot cloud hosting are in 
kind or free tier resources. They are excluded from the cash budget. 
1.8 Research Timeline 
Figure 1.1 Research and development timeline 
Weeks 1 to 12 cover the proposal development and implementation period, 
including evidence review, needs assessment, design, development, verification, and pilot 
launch. Weeks 13 to 16 cover completion of data collection, analysis, interpretation, and 
the final capstone report. The schedule separates software verification from participant 
testing so that unresolved defects or ethics requirements can stop the pilot before data 
collection begins. 
1.9 Definition of Terms 
Adaptation literacy. The ability to identify climate hazards, interpret local risk 
information, and select feasible actions that reduce harm. 
Advocacy self efficacy. A participant's confidence in finding credible information, 
communicating a concern, and using safe and lawful channels for civic participation. 
John Obure Research Proposal    |    6 
Climate justice. An approach that examines how responsibility for emissions, 
exposure to harm, decision making power, and access to adaptation resources are 
distributed. 
Climate justice awareness. Knowledge of unequal emissions and impacts, 
procedural fairness, responsibility, and credible accountability pathways. 
Offline capable. Able to load previously cached lessons and save progress without 
an active connection, then synchronise eligible records when connectivity returns. 
Progressive Web Application. A web application that can be installed and can 
remain useful during connectivity gaps. It uses browser features such as a service worker, a 
web app manifest, caching, and local storage. 
Youth. For this project, people aged 15 to 24 who live or study in Kibera or 
Ruaraka. 
John Obure Research Proposal    |    7 
CHAPTER TWO 
LITERATURE REVIEW 
2.1 Introduction 
This review examined literature on digital climate education, mobile learning, and 
offline delivery. It also covered technology acceptance, climate literacy, climate justice, 
and urban adaptation in Nairobi. The review used a structured narrative approach. This 
method connects technical design evidence with social and educational evidence without 
estimating a single pooled effect. Searches covered Google Scholar, PubMed, publisher 
databases, and institutional repositories. Search terms included climate education, mobile 
learning, Nairobi youth, Kibera flooding, climate justice, offline learning, usability, and 
Progressive Web Application. The final evidence base contains 27 peer reviewed, 
government, intergovernmental, and primary technical sources selected for relevance, 
traceability, and methodological usefulness. Product claims were checked against official 
pages for the four existing systems reviewed below. 
2.2 Conceptual Review 
The proposed intervention treats the quality of the learning application as the 
principal independent variable. Quality is represented by local relevance, language 
accessibility, interactivity, offline reliability, source transparency, and ease of use. 
Exposure is not reduced to account creation; it includes lesson access, quiz attempts, 
module completion, and successful recording of progress. These variables can be observed 
through usage records and participant responses. 
The primary dependent variables are adaptation literacy and climate justice 
awareness. Adaptation literacy covers recognition of local hazards and selection of 
appropriate actions. Climate justice awareness covers unequal responsibility and impacts, 
procedural fairness, and evidence based accountability. Advocacy self efficacy is a 
secondary outcome because knowledge alone may not translate into confidence to use 
credible, safe participation channels. 
Perceived usefulness, ease of use, and engagement may mediate the relationship 
between the application and learning outcomes. Baseline knowledge, age group, education 
status, location, prior climate experience, device access, and connectivity may influence 
John Obure Research Proposal    |    8 
both exposure and outcomes. The pilot will describe these factors but will not have 
sufficient statistical power to estimate a complex mediation model. 
Figure 2.1 Conceptual framework 
2.3 Historical Background of the Research Topic 
2.3.1 Origins and Early Context 
Climate education developed from environmental and science education that 
initially emphasised physical processes, conservation, and individual responsibility. As 
climate impacts became more visible, adaptation entered policy and education, particularly 
in countries facing immediate risks. Climate justice expanded the focus by asking who 
produced emissions, who receives protection and finance, whose knowledge counts, and 
who participates in decisions. This shift is important in Africa, where low historical 
emissions coexist with high exposure and adaptation constraints (IPCC, 2022). 
Digital learning followed a separate path from desktop educational software to web 
platforms and mobile applications. Early systems depended on continuous connectivity and 
institution owned computers. Smartphone access and stronger browsers later made mobile 
learning more feasible. Service workers and local databases also allowed web applications 
to cache resources and queue data. The educational value still depends on the learning 
design; delivery technology does not compensate for generic content, poor scaffolding, or 
weak assessment. 
John Obure Research Proposal    |    9 
2.3.2 Key Milestones 
2013 to 2014. Research showed that culture shapes adaptation. It also documented 
Africa's serious climate vulnerability. These findings support locally grounded learning 
(Adger et al., 2013; Niang et al., 2014). 
2015 to 2017. Kenya's National Adaptation Plan defined national priorities. Flood 
research in Kibera also showed the value of linking local knowledge, household action, 
and public systems (Government of Kenya, 2016; Mulligan et al., 2017). 
2019 to 2022. Economic and climate assessments documented unequal impacts, 
while UNESCO's youth survey exposed major climate knowledge gaps. Mobile learning 
studies also showed that locally situated digital activities can support conceptual learning 
(Diffenbaugh & Burke, 2019; Mettis et al., 2022; UNESCO, 2022). 
2023 to 2025. Kenya updated its national climate action plan, Nairobi experienced 
severe climate extremes, and research documented multidimensional impacts in informal 
settlements. Mobile broadband and smartphone use continued to expand. This growth 
supports mobile delivery, but it does not remove the need for offline design (Balakrishnan 
et al., 2024; Communications Authority of Kenya, 2025; Government of Kenya, 2023). 
2.3.3 Historical Gaps and Transition to the Current Study 
The historical record reveals three persistent gaps. Climate information is often 
global rather than neighbourhood specific. Education also separates adaptation from 
questions of responsibility and power. Many digital systems assume stable connectivity or 
provide little evidence of learning. Research on Nairobi's informal settlements describes 
climate exposure and community adaptation. However, few studies evaluate digital tools 
that combine adaptation and justice education for youth. The current study addresses that 
intersection while keeping its claim narrow: it tests feasibility and short term outcomes in 
two locations. 
2.4 Theoretical Review 
2.4.1 Foundational Theories 
Constructivist learning theory provides the educational foundation. Learners build 
understanding by connecting new information to prior knowledge and lived experience. 
The proposed modules begin with familiar Nairobi scenarios. Learners will make choices, 
John Obure Research Proposal    |    10 
receive feedback, and connect general climate concepts to hazards they can observe. 
Mobile learning evidence supports contextual tasks that link scientific ideas to everyday 
settings (Mettis et al., 2022; Väljataga & Mettis, 2022). 
The Technology Acceptance Model explains why a technically correct system may 
still fail. Davis (1989) identifies perceived usefulness and perceived ease of use as central 
determinants of acceptance. Local relevance and actionable guidance should make the 
application more useful. Mobile first navigation, short modules, bilingual delivery, and 
offline access should make it easier to use. The model informs usability questions but is 
not treated as proof that intention leads to sustained use. 
Climate justice provides the substantive lens. It examines how impacts and 
resources are distributed. It also considers voice, decision making, different histories, and 
different knowledge systems. The application will present evidence on unequal emissions 
and impacts alongside adaptation choices. Content will distinguish established findings, 
contested claims, and participant values so that justice education does not become partisan 
instruction. 
Together, these theories form the study's theoretical framework. Constructivism 
guides scenario based learning, the Technology Acceptance Model guides usability and 
adoption measures, and climate justice guides content selection and interpretation. The 
framework expects locally meaningful content to be easy to use and ethically presented. 
These conditions should support learning and civic confidence. 
2.5 Overview of Existing Systems 
Four software systems were reviewed because each addresses part of the proposed 
problem. ClimateScience offers short climate courses and quizzes. Earth Hero calculates a 
personal footprint and recommends actions. NASA Climate Kids presents accessible 
games, activities, videos, and articles. The Kenya Meteorological Department portal 
provides authoritative national forecasts, reports, and advisories. The comparison focuses 
on observable software functions and fit with the proposed users rather than on claims 
about product intent. 
John Obure Research Proposal    |    11 
2.5.1 Strengths and Weaknesses of Existing Systems 
Table 2.1 Comparison of existing software systems 
System 
Relevant functions 
ClimateScience 
Short courses, quizzes, 
levels, global climate 
topics 
Strength 
Structured and engaging 
learning pathway 
Gap for this study 
Limited Nairobi specific 
adaptation and justice 
content; offline pilot fit 
not established 
Earth Hero 
NASA Climate Kids 
KMD portal 
Proposed PWA 
Footprint calculator, goals, 
personalised actions, 
sharing 
Games, activities, videos, 
articles 
Forecasts, advisories, 
reports, climate services 
Local modules, offline 
access, bilingual content, 
assessments, progress and 
verified resources 
Turns information into 
trackable personal actions 
Clear multimedia 
explanations from an 
authoritative science 
organisation 
Authoritative Kenya 
specific climate 
information 
Combines Nairobi 
adaptation, justice literacy, 
and research measurement 
Primary frame is personal 
emissions reduction; 
limited local adaptation 
instruction 
Designed mainly for 
younger learners and 
global science; no Nairobi 
pilot assessment pathway 
Information portal rather 
than a guided bilingual 
youth curriculum with 
pretest and posttest 
evaluation 
Small pilot, no long term 
evidence, and content 
quality depends on 
independent review 
The comparison does not establish that the proposed product is superior. It 
establishes a testable design gap: none of the reviewed systems combines the study's 
content, access, and measurement requirements. The pilot must show whether this 
combination produces usable learning rather than assuming that feature integration creates 
value. 
2.6 Review of Related Works 
Empirical research supports the need for local context. Adger et al. (2013) show 
that culture shapes how people understand impacts and adaptation. Mulligan et al. (2017) 
show that community engagement affects the feasibility of flood responses in Kibera. 
Balakrishnan et al. (2024) extend this local evidence. They document effects on health, 
finances, water, food, drainage, safety, and social life in Kibera and Mathare. These studies 
justify content based on lived urban conditions rather than generic lists of climate actions. 
Research also supports the learning approach, although not in the same population. 
Mettis et al. (2022) used mobile outdoor learning with 158 secondary students and found 
John Obure Research Proposal    |    12 
gains in knowledge and conceptual change. Väljataga and Mettis (2022) similarly 
examined knowledge gain and scaffolding needs in mobile outdoor settings. These studies 
suggest that mobile technology can support contextual learning. However, their settings do 
not show that an offline web application will work for Nairobi youth. This proposal 
therefore measures learning directly. 
The justice content rests on documented evidence rather than rhetorical attribution. 
Diffenbaugh and Burke (2019) found that historical warming increased economic 
inequality between countries. Supran et al. (2023) assessed ExxonMobil's internal 
projections and found that most accurately forecast warming. A joint congressional staff 
report separately documented public communication practices designed to avoid 
accountability (United States House Committee on Oversight and Accountability & United 
States Senate Budget Committee, 2024). These sources support a module on evidence, 
responsibility, and evaluating claims. The module will present cited documents and avoid 
asserting legal liability that the study cannot determine. 
For usability, the System Usability Scale provides a short standardised instrument 
suitable for a pilot (Brooke, 1996). A score of 68 is often used as an approximate 
benchmark for average usability (Bangor et al., 2009). However, this study will also 
consider confidence intervals and qualitative comments. It will not treat the score as a 
simple pass or fail result. The study will also record completion, error, and offline 
synchronisation rates. Perceived usability alone cannot show whether the software works 
under real access conditions. 
2.6.1 Summary of Reviewed Literature 
Table 2.2 Summary of empirical literature 
Source 
Method and sample 
Adger et al. 2013 
Cross regional conceptual 
and empirical synthesis 
Relevant finding 
Culture is integral to climate 
impacts and adaptation 
Design implication 
Use local knowledge and 
avoid universalised content 
Diffenbaugh and Burke 
2019 
Mulligan et al. 2017 
Mettis et al. 2022 
Econometric analysis of 165 
countries 
Survey of 963 Kibera 
households plus stakeholder 
consultation 
Action research with 158 
learners 
Warming increased between 
country economic inequality 
Community responsive 
approaches address limits of 
household and public action 
Mobile situated learning 
supported knowledge and 
conceptual change 
Ground justice content in 
measurable distributional 
evidence 
Teach household actions 
together with collective and 
institutional responses 
Use contextual scenarios 
and measure learning before 
and after 
John Obure Research Proposal    |    13 
Source Method and sample Relevant finding Design implication 
Supran et al. 2023 
Quantitative analysis of 
company climate 
projections 
Internal projections 
accurately forecast warming 
Balakrishnan et al. 2024 
UNESCO 2022 
Six monthly surveys with 
800 women in Kibera and 
Mathare 
Global youth climate 
education survey 
2.7 General Comments 
Extreme weather effects 
span health, finance, 
services, safety, and 
environment 
Large shares of youth 
reported limited ability to 
explain climate change 
Use primary evidence to 
teach claim evaluation and 
accountability 
Represent climate risk as 
multidimensional and 
locally experienced 
Assess baseline knowledge 
and design for explanation 
rather than exposure alone 
The literature supports the problem but does not guarantee the solution. Nairobi 
youth face real climate and information risks. Local mobile learning may support 
understanding. Digital access is also widespread enough to justify a mobile first 
experiment. However, direct evidence is missing at the intersection of Nairobi youth, 
adaptation literacy, climate justice, bilingual offline delivery, and measured learning 
outcomes. The proposed study addresses that narrow gap. 
The evidence also places limits on the project. A 50 person purposive pilot cannot 
estimate effects for all Nairobi youth. A one group design cannot separate the application 
effect from testing or maturation. Immediate posttest gains also cannot show long term 
behaviour change. These limits shape the methodology in Chapter Three and prevent 
promotional claims that the application has solved climate vulnerability. 
John Obure Research Proposal    |    14 
CHAPTER THREE 
SYSTEM ANALYSIS AND DESIGN 
3.1 Introduction 
This chapter explains how the proposed application will be designed and how the 
pilot will be evaluated. The project uses a design science approach. It creates and tests a 
software artefact in response to an identified problem (Hevner et al., 2004). The pilot uses 
mixed methods. Quantitative evidence will come from assessments, usability responses, 
and usage records. Focus groups and observation will provide qualitative evidence 
(Creswell & Plano Clark, 2018). Agile development supports iterative implementation, 
while formal entry criteria separate software testing from research involving participants. 
3.2 Research Design 
The evaluation uses a one group pretest and posttest pilot. Participants complete a 
baseline assessment, use the application during the defined pilot period, and complete an 
equivalent endline assessment and usability survey. Focus groups follow the quantitative 
stage to explain unexpected results and identify content or interaction problems. The 
design can estimate observed short term change within the pilot group but cannot 
demonstrate causality because it has no randomised comparison group. 
Table 3.1 Objective, research question, and evidence alignment 
Objective and question 
Evidence source 
Analysis 
SO1 / RQ1 Climate learning 
needs 
Literature review, needs 
survey, stakeholder 
interviews 
Priority hazards and 
baseline knowledge gaps 
Output 
Learning requirements and 
content priorities 
SO2 / RQ2 Access and 
preferences 
SO3 / RQ3 Application 
design 
SO4 / RQ4 Learning 
outcomes 
SO5 / RQ5 Feasibility 
outcomes 
Needs survey, stakeholder 
interviews, device and 
connectivity questions 
Usability tasks, observation, 
accessibility and technical 
verification 
Equivalent pretest and 
posttest assessments 
SUS, usage records, 
synchronisation logs, focus 
groups 
Language, content, device, 
and connectivity patterns 
Task completion, observed 
barriers, and verification 
results 
Knowledge and self efficacy 
change with uncertainty 
estimates 
Usability, completion, 
offline reliability, and 
qualitative themes 
Access requirements and 
delivery choices 
Verified bilingual offline 
capable prototype 
Pilot learning outcome 
estimates 
Feasibility judgement and 
revision priorities 
John Obure Research Proposal    |    15 
3.2.1 Study Population and Sampling 
The target population is youth aged 15 to 24 who live or study in Kibera or 
Ruaraka. Approximately 50 participants will be recruited through cooperating community 
organisations or educational institutions, with an intended allocation of about 25 
participants per location. Purposive quota sampling will seek variation by age group, 
gender, and education status. The sample is appropriate for a capstone feasibility pilot but 
is not statistically representative. 
Eligible participants must meet the age requirement and understand English or 
Kiswahili. They must also have access to a browser capable phone or shared pilot device 
and complete the consent process. Participants aged 15 to 17 must provide assent and have 
written parent or guardian consent. Participation in research will not be required to access 
public educational content after the pilot. 
3.2.2 Data Collection and Analysis 
The needs assessment will address SO1, SO2, RQ1, and RQ2. It will use a short 
structured survey and up to four stakeholder interviews with youth facilitators, educators, 
or community organisation representatives. The findings will also guide the prototype 
developed under SO3 and RQ3. 
The baseline and endline assessments will address SO4 and RQ4. They will contain 
20 equivalent knowledge items, divided between adaptation literacy and climate justice 
awareness, plus five Likert items on advocacy self efficacy. Equivalent forms will use the 
same blueprint and difficulty rather than repeat every item verbatim. 
The post pilot evaluation will address SO5 and RQ5. Participants will complete the 
ten item System Usability Scale and two open ended questions on the most useful and most 
difficult parts of the experience. Application records will capture coded participant ID, 
module access, completion percentage, quiz attempts, timestamps, and synchronisation 
status. They will not record free text messages, contact lists, precise location, or unrelated 
device activity. 
Descriptive statistics will report means, medians, standard deviations, proportions, 
and 95 percent confidence intervals where appropriate. A paired samples t test will analyse 
knowledge scores when the difference scores are reasonably symmetric. Otherwise, the 
study will use the Wilcoxon signed rank test. Cohen's dz or a rank based effect size will 
John Obure Research Proposal    |    16 
accompany the significance test. Because this is a pilot, effect estimates and uncertainty 
matter more than a binary p value. Focus group notes will be analysed using a concise 
reflexive thematic process with an audit trail (Braun & Clarke, 2019). 
At least two reviewers will assess the instruments. One will have climate or 
environmental expertise, and the other will have education or youth experience. Five 
nonparticipant testers will complete cognitive interviews and usability tasks before the 
pilot. The study will report internal consistency for multi item scales. Low reliability in the 
small sample will guide instrument revision and will not be concealed. 
3.2.3 Software Development Life Cycle 
Development will follow six two week Agile sprints informed by the Scrum Guide 
but adapted for a single developer (Schwaber & Sutherland, 2020). Sprint 1 covers 
requirements, ethics dependencies, and architecture. Sprint 2 delivers coded onboarding, 
language selection, and the assessment shell. Sprints 3 and 4 deliver modules, quizzes, 
progress, offline caching, and administration. Sprint 5 covers accessibility, security, 
performance, and external beta testing. Sprint 6 resolves blocking defects and prepares the 
pilot release. Pilot data collection begins only after consent materials, content review, and 
critical verification tests are complete. 
3.2.4 Metrics for Evaluation 
Table 3.2 Evaluation metrics and decision rules 
Domain 
Measure 
Adaptation literacy (SO4, 
RQ4) 
Ten scored items converted 
to 0 to 100 
Analysis 
Mean change and 
proportion gaining at least 
10 points 
Decision rule 
Promising if at least 60 
percent gain 10 or more 
points and mean change is 
positive 
Climate justice awareness 
(SO4, RQ4) 
Advocacy self efficacy 
(SO4, RQ4) 
Usability (SO5, RQ5) 
Engagement (SO5, RQ5) 
Ten scored items converted 
to 0 to 100 
Five item Likert scale 
System Usability Scale 
Required module 
completion 
Mean change and 
proportion gaining at least 
10 points 
Mean or median change 
with distribution 
Mean score and 95 percent 
confidence interval 
Completed modules divided 
by assigned modules 
Promising if at least 60 
percent gain 10 or more 
points and no item shows 
systematic misconception 
Interpret direction and 
uncertainty; no causal claim 
Target mean at or above 68 
with no recurring critical 
task failure 
Target at least 75 percent 
median completion 
John Obure Research Proposal    |    17 
 
Domain Measure Analysis Decision rule 
Offline reliability (SO5, 
RQ5) Queued records and sync 
outcomes 
Successful unique commits 
divided by eligible queued 
records 
Target at least 95 percent 
without duplicate records 
Accessibility and 
performance (SO3, RQ3) Automated and manual 
checks on target devices Critical WCAG issues, load 
and repeat access time 
No critical blocker; cold 
load within 3 seconds on 
throttled 3G for the tested 
build 
 
The decision rules are pilot thresholds, not proof of effectiveness. If knowledge 
improves but usability or offline reliability fails, the product is not ready to scale. If 
usability is strong but learning does not improve, content and instructional design require 
revision before additional technical expansion. 
3.3 System Analysis 
The system has two human roles: youth participant and administrator researcher. 
Public visitors may access general information, but research features require a coded 
participant account. The application separates educational content from research 
administration and stores only the data necessary to answer the research questions. 
3.3.1 Functional Requirements of the System 
Table 3.3 Functional requirements 
ID Requirement Priority 
FR01 
The system shall allow an authorised 
participant to create or activate a 
coded profile without entering a 
public display name. 
Must 
FR02 
The system shall present reviewed 
modules in English and Kiswahili 
with consistent lesson order and 
source links. 
Must 
FR03 The system shall cache core lessons 
and application assets for offline 
access after first successful loading. Must 
FR04 
The system shall save quiz responses 
and progress locally when offline 
and synchronise them when 
connectivity returns. 
Must 
FR05 The system shall administer baseline 
and endline assessments and store 
scored domain results. Must 
John Obure Research Proposal    |    18 
 
ID Requirement Priority 
FR06 The system shall show participants 
their module progress without 
exposing other participants' data. Must 
FR07 
The administrator shall manage 
reviewed content versions, 
participant access, and aggregate 
pilot status. 
Must 
FR08 The administrator shall export a 
pseudonymous research dataset with 
a documented data dictionary. Must 
FR09 
The system shall provide verified 
links to official or established 
climate resources without hosting 
campaigns or public user posts. 
Should 
 
3.3.2 Non Functional Requirements of the System 
Table 3.4 Non functional requirements 
Category Measurable requirement 
Performance 
Largest Contentful Paint within three seconds on the 
defined throttled 3G test profile for the pilot build; 
cached lesson reopening within one second on tested 
devices. 
Accessibility Conform to WCAG 2.2 AA for pilot paths, including 
keyboard access, visible focus, text alternatives, contrast, 
labels, and zoom without loss of content (W3C, 2023). 
Security TLS in transit, strong password hashing for administrator 
accounts, short lived signed sessions, role checks, rate 
limiting, input validation, and no secrets in client code. 
Privacy Pseudonymous research IDs, separate consent records, 
no precise location, least privilege access, and 
documented retention and deletion dates. 
Reliability Core cached lessons remain readable offline; eligible 
queued records synchronise without duplicates; backup 
restoration is tested before the pilot. 
Compatibility Support the current and previous major versions of 
Chrome and Android WebView used on pilot devices, 
with graceful fallback on other modern browsers. 
Maintainability Typed interfaces, automated tests for scoring and sync 
logic, versioned migrations, a deployment guide, and a 
content review workflow. 
Availability 
Target at least 95 percent measured API availability 
during the monitored pilot, excluding planned 
maintenance; offline lessons remain available during 
outages. 
 
John Obure Research Proposal    |    19 
3.3.3 Proposed Model Diagram 
Figure 3.1 Mission aligned design and evaluation model 
The model links evidence and user needs to a co designed software artefact and 
then to measurable pilot outcomes. Results return to the backlog as prioritised changes. 
Consent, data minimisation, source review, and accessibility will guide the full 
development cycle. The ban on in application campaigning will apply throughout. These 
safeguards will not be added only after development. 
3.4 System Design 
The system uses an offline capable three layer architecture. The client layer renders 
the user interface and maintains a local cache and synchronisation queue. The application 
layer validates requests, applies access rules, serves content, scores assessments, and 
produces authorised research exports. The data layer stores pseudonymous records, media 
assets, logs, and backups. This separation keeps offline behaviour explicit and prevents the 
administrator interface from being treated as part of the database layer. 
John Obure Research Proposal    |    20 
Figure 3.2 Progressive web application architecture 
The use case model assigns each action to a human role. Automated behaviours 
such as scoring and caching are internal system responsibilities, not external actors. Youth 
users can study, complete assessments, and view their own progress. Administrators can 
manage reviewed content and participant access, monitor aggregate engagement, and 
export pseudonymous research data. 
John Obure Research Proposal    |    21 
Figure 3.3 System use case diagram 
The relational design separates participants, learning content, assessments, 
responses, and progress. Questions belong to the assessment bank rather than to an 
individual completed assessment. Responses connect an assessment instance to a question. 
A composite uniqueness rule for each participant and module will prevent duplicate 
progress rows. Server generated idempotency keys will prevent duplicate synchronisation 
commits. 
John Obure Research Proposal    |    22 
Figure 3.4 Relational data model 
The back end class design separates authentication, content, assessment, and 
progress rules into services. Repository classes isolate database access. Controllers remain 
thin and are omitted from the diagram because their role is limited to request validation, 
service calls, and response mapping. This structure is more maintainable than placing 
research scoring and persistence directly inside route handlers. 
John Obure Research Proposal    |    23 
Figure 3.5 Back end service and repository class diagram 
The participant flow begins with information and consent, then creates a coded 
profile and captures baseline knowledge before module access. Participants repeat lessons 
until the required set is complete. Endline assessment and usability questions follow. The 
flow avoids algorithmic recommendations; the curriculum order is transparent and can be 
revised through content governance. 
John Obure Research Proposal    |    24 
Figure 3.6 Participant learning and assessment flow 
Offline synchronisation uses a local queue with unique record identifiers. When the 
device reconnects, the service worker submits queued progress and quiz records to the 
API. The API validates the participant session and writes the records in a transaction. A 
committed identifier is returned so the client can mark the local item as synchronised. 
Failed items remain queued, and retries do not create duplicates. 
John Obure Research Proposal    |    25 
Figure 3.7 Offline progress synchronisation sequence 
3.5 Development Tools 
Table 3.5 Development tools and rationale 
Layer 
Proposed tool 
Interface 
React with TypeScript and Vite 
Rationale 
Component based mobile interface, 
static type checking, and efficient 
build tooling 
Styling 
Tailwind CSS 
Consistent responsive layout and 
accessible design tokens 
Offline layer 
API 
Database 
Security 
Testing 
Service worker, Cache API, 
IndexedDB 
Node.js and Express 
PostgreSQL with Sequelize 
TLS, signed sessions or JWT, bcrypt 
or Argon2, validation and rate 
limiting 
Vitest or Jest, Supertest, Playwright, 
Lighthouse, axe 
Cached lessons, local progress 
queue, and controlled 
synchronisation 
Small REST API with a mature 
package ecosystem and 
straightforward deployment 
Relational integrity for participants, 
assessments, responses, and progress 
Authentication, authorisation, 
transport protection, and abuse 
controls 
Unit, API, end to end, performance, 
and accessibility checks 
John Obure Research Proposal    |    26 
Layer 
Deployment 
Proposed tool 
Vercel for the PWA and Railway or 
equivalent managed service for API 
and database 
Rationale 
Pilot scale hosting with HTTPS, 
logs, and managed backups 
Research analysis 
Design and modelling 
3.6 Ethical Considerations 
R or Jamovi plus spreadsheet 
validation 
Figma and diagrams.net 
Reproducible paired analysis, 
descriptive statistics, confidence 
intervals, and charts 
Interface prototyping and editable 
system diagrams 
Ethics approval or written institutional clearance will be obtained before 
recruitment or data collection. Adults will provide informed consent. Participants aged 15 
to 17 will provide assent and require separate written parent or guardian consent. 
Information sheets will explain the study purpose, activities, time, discomforts, data use, 
and voluntary participation. They will also provide a contact for questions. English and 
Kiswahili versions will be available. 
The software will minimise personal data. Research accounts will use coded 
identifiers; precise addresses, contact lists, public profiles, and open posting will not be 
collected. Consent records will be stored separately from research data. Access will be 
limited by role, exports will be pseudonymous, and the retention period and deletion 
procedure will be approved before the pilot. Participants may withdraw future 
participation, while the information sheet will explain any limit on deleting data that has 
already been anonymised and aggregated. 
Climate impacts and injustice may cause distress, particularly for participants with 
direct experience of flooding or loss. Facilitators will allow participants to skip questions 
or stop without penalty and will provide locally appropriate support contacts approved by 
the partner organisation. The content will pair risk information with feasible protective 
actions. It will not ask minors to join campaigns, contact political actors, or share personal 
experiences publicly. 
The researcher supports climate justice as a project motivation. That position 
creates a risk of selecting only confirmatory evidence or framing contested issues as 
settled. The researcher will log sources and obtain an independent content review. The 
study will use neutral wording and balanced response options. It will disclose analytical 
John Obure Research Proposal    |    27 
decisions and report negative or null findings. Educational content will remain separate 
from political mobilisation. 
The study provides direct educational access but will not offer payment for 
particular answers or completion outcomes. Refreshments and any transport support will 
be modest and described in advance. Recruitment through schools or community 
organisations will not allow teachers, managers, or facilitators to pressure participation or 
view individual responses. 
John Obure Research Proposal    |    28 
References 
Adger, W. N., Barnett, J., Brown, K., Marshall, N., & O'Brien, K. (2013). Cultural 
dimensions of climate change impacts and adaptation. Nature Climate Change, 
3(2), 112-117. https://doi.org/10.1038/nclimate1666 
Balakrishnan, A. K., Otieno, S., Dzombo, M., Plaxico, L., Ukoh, E., Obara, L. M., Brown, 
H., Musyimi, C., Lincoln, C., Yang, L. S., Witte, S. S., & Winter, S. C. (2024). 
Socio-ecological impacts of extreme weather events in two informal settlements in 
Nairobi, Kenya. Frontiers in Public Health, 12, 1389054. 
https://doi.org/10.3389/fpubh.2024.1389054 
Bangor, A., Kortum, P., & Miller, J. (2009). Determining what individual SUS scores mean 
Adding an adjective rating scale. Journal of Usability Studies, 4(3), 114-123. 
Braun, V., & Clarke, V. (2019). Reflecting on reflexive thematic analysis. Qualitative 
Research in Sport Exercise and Health, 11(4), 589-597. 
https://doi.org/10.1080/2159676X.2019.1628806 
Brooke, J. (1996). SUS A quick and dirty usability scale. In P. W. Jordan, B. Thomas, B. 
A. Weerdmeester, & I. L. McClelland (Eds.), Usability evaluation in industry (pp. 
189-194). Taylor and Francis. 
ClimateScience. (2024). ClimateScience app. MIT Solve. 
https://solve.mit.edu/challenges/2024-global-learning-challenge/solutions/89887 
Communications Authority of Kenya. (2025). Second quarter sector statistics report for the 
financial year 2024 2025. 
https://www.ca.go.ke/sites/default/files/2025-03/Sector%20Statistics%20Report%2
0Q2%202024-2025.pdf 
Creswell, J. W., & Plano Clark, V. L. (2018). Designing and conducting mixed methods 
research (3rd ed.). SAGE. 
Davis, F. D. (1989). Perceived usefulness perceived ease of use and user acceptance of 
information technology. MIS Quarterly, 13(3), 319-340. 
https://doi.org/10.2307/249008 
John Obure Research Proposal    |    29 
Diffenbaugh, N. S., & Burke, M. (2019). Global warming has increased global economic 
inequality. Proceedings of the National Academy of Sciences, 116(20), 9808-9813. 
https://doi.org/10.1073/pnas.1816020116 
Earth Hero. (2025). Earth Hero climate action app. https://earthhero.org/ 
Government of Kenya. (2016). Kenya national adaptation plan 2015 2030. Ministry of 
Environment and Natural Resources. 
https://www4.unfccc.int/sites/NAPC/Documents%20NAP/Kenya_NAP_Final.pdf 
Government of Kenya. (2023). National climate change action plan 2023 2027. Ministry of 
Environment Climate Change and Forestry. 
https://faolex.fao.org/docs/pdf/ken229355.pdf 
Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information 
systems research. MIS Quarterly, 28(1), 75-105. https://doi.org/10.2307/25148625 
Intergovernmental Panel on Climate Change. (2022). Climate change 2022 Impacts 
adaptation and vulnerability. Cambridge University Press. 
https://doi.org/10.1017/9781009325844 
Kenya Meteorological Department. (2024). State of the climate in Kenya 2023. 
https://meteo.go.ke/our-products/state-of-the-climate-kenya-report/state-of-the-clim
ate-kenya-report-2023/ 
Kenya Meteorological Department. (2025). State of the climate in Kenya 2024. 
https://meteo.go.ke/our-products/state-of-the-climate-kenya-report/ 
Mettis, K., Väljataga, T., & Uus, Õ. (2022). Mobile outdoor learning effect on students' 
conceptual change and transformative experience. Technology Knowledge and 
Learning, 28, 705-726. https://doi.org/10.1007/s10758-022-09614-w 
Mulligan, J., Harper, J., Kipkemboi, P., Ngobi, B., & Collins, A. (2017). 
Community-responsive adaptation to flooding in Kibera, Kenya. Proceedings of the 
Institution of Civil Engineers Engineering Sustainability, 170(5), 268-280. 
https://doi.org/10.1680/jensu.15.00060 
National Aeronautics and Space Administration. (2026). NASA Climate Kids. 
https://www.nasa.gov/stem-content/nasa-climate-kids/ 
John Obure Research Proposal    |    30 
Niang, I., Ruppel, O. C., Abdrabo, M. A., Essel, A., Lennard, C., Padgham, J., & Urquhart, 
P. (2014). Africa. In V. R. Barros et al. (Eds.), Climate change 2014 Impacts 
adaptation and vulnerability Part B Regional aspects (pp. 1199-1265). Cambridge 
University Press. 
Schwaber, K., & Sutherland, J. (2020). The Scrum guide. 
https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf 
Supran, G., Rahmstorf, S., & Oreskes, N. (2023). Assessing ExxonMobil's global warming 
projections. Science, 379(6628), eabk0063. 
https://doi.org/10.1126/science.abk0063 
UNESCO. (2022). Youth demands for quality climate change education. 
https://unesdoc.unesco.org/ark:/48223/pf0000383615 
United States House Committee on Oversight and Accountability & United States Senate 
Budget Committee. (2024). Denial disinformation and doublespeak Big Oil's 
evolving efforts to avoid accountability for climate change. 
https://www.budget.senate.gov/imo/media/doc/fossil_fuel_report1.pdf 
Väljataga, T., & Mettis, K. (2022). Secondary education students' knowledge gain and 
scaffolding needs in mobile outdoor learning settings. Sustainability, 14(12), 7031. 
https://doi.org/10.3390/su14127031 
World Wide Web Consortium. (2023). Web content accessibility guidelines WCAG 2.2. 
https://www.w3.org/TR/WCAG22/ 
John Obure Research Proposal    |    31 