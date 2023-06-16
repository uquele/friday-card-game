const CARDS_TSV = `id	type	name	power	skillName	removeCost	phaseGreen	phaseYellow	phaseRed	draw	agingType	agingEffectName	pirateEffectName
1	Fighting	Weak	-1		1							
2	Fighting	Hungry	-1		1							
3	Fighting	Scared	-1		1							
4	Fighting	Confused	-1		1							
5	Fighting	Sleepy	-1		1							
6	Fighting	Well fed	0	Life +2	1							
7	Fighting	Stupid	0		1							
8	Fighting	Lazy	0		1							
9	Fighting	Depressed	0		1							
10	Fighting	Curious	0		1							
11	Fighting	Dumb	0		1							
12	Fighting	Naive	0		1							
13	Fighting	Foolish	0		1							
14	Fighting	Slow	0		1							
15	Fighting	Crafty	1		1							
16	Fighting	Happy	1		1							
17	Fighting	Courageous	1		1							
18	Fighting	Strong	2		1							
19	Hazard	Cannibals	4		1	5	9	14	5			
20	Hazard	Wild bear	4		1	5	9	14	5			
21	Hazard	Anaconda	3	Destroy	1	4	7	11	4			
22	Hazard	Wild boar	3	Draw +1	1	4	7	11	4			
23	Hazard	Wild wolf	3	Vision	1	4	7	11	4			
24	Hazard	Jaguar	3	Exchange 1	1	4	7	11	4			
25	Hazard	Earthquake	2	Exchange 1	1	2	5	8	3			
26	Hazard	Flood	2	Double	1	2	5	8	3			
27	Hazard	Storm	2	Draw +1	1	2	5	8	3			
28	Hazard	Cobra	2	Destroy	1	2	5	8	3			
29	Hazard	Quicksand	2	Vision	1	2	5	8	3			
30	Hazard	Hurricane	2	Life +1	1	2	5	8	3			
31	Hazard	Landslide	1	Life +1	1	1	3	6	2			
32	Hazard	Hail	2		1	1	3	6	2			
33	Hazard	Wild pig	1	Double	1	1	3	6	2			
34	Hazard	Tarantula	1	Life +1	1	1	3	6	2			
35	Hazard	Wasp nest	1	Copy	1	1	3	6	2			
36	Hazard	Heavy rain	1	Destroy	1	1	3	6	2			
37	Hazard	Piranhas	1	Put under pile	1	1	3	6	2			
38	Hazard	Flu	2		1	1	3	6	2			
39	Hazard	Deep cave	0	Put under pile	1	0	1	3	1			
40	Hazard	Wild horses	0	Copy	1	0	1	3	1			
41	Hazard	Heat	0	Draw +2	1	0	1	3	1			
42	Hazard	Swift river	0	Draw +2	1	0	1	3	1			
43	Hazard	Raft	0	Life +1	1	0	1	3	1			
44	Hazard	Rocky shore	0	Stage -1	1	0	1	3	1			
45	Hazard	Scarce food	0	Destroy	1	0	1	3	1			
46	Hazard	Steep slope	0	Life +1	1	0	1	3	1			
47	Hazard	Mosquitoes	0	Exchange 2	1	0	1	3	1			
48	Hazard	Closed chest	0	Exchange 2	1	0	1	3	1			
49	Aging	Nauseous	0		2					Old	Highest 0	
50	Aging	Wounded	-2		2					Old		
51	Aging	Exhausted	0		2					Old	Stop	
52	Aging	Very weak	-1		2					Old		
53	Aging	Sick	0		2					Old	Life -1	
54	Aging	Very stupid	-3		2					Old		
55	Aging	Terrified	-2		2					Old		
56	Aging	Dizzy	0		2					Old	Highest 0	
57	Aging	Suicidal	-5		2					Very old		
58	Aging	Very old	-4		2					Very old		
59	Aging	Very sick	0		2					Very old	Life -2	
60	Pirates	6 pirates	20						6			none
61	Pirates	7 pirates	25						7			none
62	Pirates	8 pirates	30						8			none
63	Pirates	9 pirates	35						9			none
64	Pirates	10 pirates	40						10			none
65	Pirates	Scary pirates	22						9			Only half of your cards (round up) have any power
66	Pirates	Slow pirates	52						10			Each of your cards has +1 power
67	Pirates	Archers	16						7			Each extra card drawn costs 2 life instead of 1
68	Pirates	Swordsmen	X						5			Power X is number of aging cards added to game x2
69	Pirates	Pack of hounds	X						X			You have to beat all unbeaten danger cards at once`