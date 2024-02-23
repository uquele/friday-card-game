// TSV format is used for convenience.
// Use ODS spreadsheet, make changes there, copy-paste spreadsheet cells here to apply changes.

export const CARDS_TSV = `id	type	name	power	skillName	removeCost	phaseGreen	phaseYellow	phaseRed	draw	agingType	agingEffectName	pirateEffectName
1	fighting	Weak	-1		1							
2	fighting	Hungry	-1		1							
3	fighting	Scared	-1		1							
4	fighting	Confused	-1		1							
5	fighting	Sleepy	-1		1							
6	fighting	Well fed	0	Life +2	1							
7	fighting	Stupid	0		1							
8	fighting	Lazy	0		1							
9	fighting	Depressed	0		1							
10	fighting	Curious	0		1							
11	fighting	Dumb	0		1							
12	fighting	Naive	0		1							
13	fighting	Foolish	0		1							
14	fighting	Slow	0		1							
15	fighting	Crafty	1		1							
16	fighting	Happy	1		1							
17	fighting	Courageous	1		1							
18	fighting	Strong	2		1							
19	hazard	Cannibals	4		1	5	9	14	5			
20	hazard	Wild bear	4		1	5	9	14	5			
21	hazard	Anaconda	3	Destroy	1	4	7	11	4			
22	hazard	Wild boar	3	Draw +1	1	4	7	11	4			
23	hazard	Wild wolf	3	Vision	1	4	7	11	4			
24	hazard	Jaguar	3	Exchange 1	1	4	7	11	4			
25	hazard	Earthquake	2	Exchange 1	1	2	5	8	3			
26	hazard	Flood	2	Double	1	2	5	8	3			
27	hazard	Storm	2	Draw +1	1	2	5	8	3			
28	hazard	Cobra	2	Destroy	1	2	5	8	3			
29	hazard	Quicksand	2	Vision	1	2	5	8	3			
30	hazard	Hurricane	2	Life +1	1	2	5	8	3			
31	hazard	Landslide	1	Life +1	1	1	3	6	2			
32	hazard	Hail	2		1	1	3	6	2			
33	hazard	Wild pig	1	Double	1	1	3	6	2			
34	hazard	Tarantula	1	Life +1	1	1	3	6	2			
35	hazard	Wasp nest	1	Copy	1	1	3	6	2			
36	hazard	Heavy rain	1	Destroy	1	1	3	6	2			
37	hazard	Piranhas	1	Put under pile	1	1	3	6	2			
38	hazard	Flu	2		1	1	3	6	2			
39	hazard	Deep cave	0	Put under pile	1	0	1	3	1			
40	hazard	Wild horses	0	Copy	1	0	1	3	1			
41	hazard	Heat	0	Draw +2	1	0	1	3	1			
42	hazard	Swift river	0	Draw +2	1	0	1	3	1			
43	hazard	Raft	0	Life +1	1	0	1	3	1			
44	hazard	Rocky shore	0	Stage -1	1	0	1	3	1			
45	hazard	Scarce food	0	Destroy	1	0	1	3	1			
46	hazard	Steep slope	0	Life +1	1	0	1	3	1			
47	hazard	Mosquitoes	0	Exchange 2	1	0	1	3	1			
48	hazard	Closed chest	0	Exchange 2	1	0	1	3	1			
49	aging	Nauseous	0		2					Old	Highest 0	
50	aging	Wounded	-2		2					Old		
51	aging	Exhausted	0		2					Old	Stop	
52	aging	Very weak	-1		2					Old		
53	aging	Sick	0		2					Old	Life -1	
54	aging	Very stupid	-3		2					Old		
55	aging	Terrified	-2		2					Old		
56	aging	Dizzy	0		2					Old	Highest 0	
57	aging	Suicidal	-5		2					Very old		
58	aging	Very old	-4		2					Very old		
59	aging	Very sick	0		2					Very old	Life -2	
60	pirates	6 pirates	20						6			none
61	pirates	7 pirates	25						7			none
62	pirates	8 pirates	30						8			none
63	pirates	9 pirates	35						9			none
64	pirates	10 pirates	40						10			none
65	pirates	Scary pirates	22						9			Only half of your cards (round up) have any power
66	pirates	Slow pirates	52						10			Each of your cards has +1 power
67	pirates	Archers	16						7			Each extra card drawn costs 2 life instead of 1
68	pirates	Swordsmen	X						5			Power X is number of aging cards added to game x2
69	pirates	Pack of hounds	X						X			You have to beat all unbeaten danger cards at once`