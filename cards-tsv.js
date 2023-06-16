const CARDS_TSV = `type	name	power	skillName	removeCost	dangerStage1	dangerStage2	dangerStage3	draw	agingType	agingEffectName	pirateEffectName
Robinson	Weak	-1		1							
Robinson	Hungry	-1		1							
Robinson	Scared	-1		1							
Robinson	Confused	-1		1							
Robinson	Sleepy	-1		1							
Robinson	Well fed	0	Life +2	1							
Robinson	Stupid	0		1							
Robinson	Lazy	0		1							
Robinson	Depressed	0		1							
Robinson	Curious	0		1							
Robinson	Dumb	0		1							
Robinson	Naive	0		1							
Robinson	Foolish	0		1							
Robinson	Slow	0		1							
Robinson	Crafty	1		1							
Robinson	Happy	1		1							
Robinson	Courageous	1		1							
Robinson	Strong	2		1							
Danger	Cannibals	4		1	5	9	14	5			
Danger	Wild bear	4		1	5	9	14	5			
Danger	Anaconda	3	Destroy	1	4	7	11	4			
Danger	Wild boar	3	Draw +1	1	4	7	11	4			
Danger	Wild wolf	3	Vision	1	4	7	11	4			
Danger	Jaguar	3	Exchange 1	1	4	7	11	4			
Danger	Earthquake	2	Exchange 1	1	2	5	8	3			
Danger	Flood	2	Double	1	2	5	8	3			
Danger	Storm	2	Draw +1	1	2	5	8	3			
Danger	Cobra	2	Destroy	1	2	5	8	3			
Danger	Quicksand	2	Vision	1	2	5	8	3			
Danger	Hurricane	2	Life +1	1	2	5	8	3			
Danger	Landslide	1	Life +1	1	1	3	6	2			
Danger	Hail	2		1	1	3	6	2			
Danger	Wild pig	1	Double	1	1	3	6	2			
Danger	Tarantula	1	Life +1	1	1	3	6	2			
Danger	Wasp nest	1	Copy	1	1	3	6	2			
Danger	Heavy rain	1	Destroy	1	1	3	6	2			
Danger	Piranhas	1	Put under pile	1	1	3	6	2			
Danger	Flu	2		1	1	3	6	2			
Danger	Deep cave	0	Put under pile	1	0	1	3	1			
Danger	Wild horses	0	Copy	1	0	1	3	1			
Danger	Heat	0	Draw +2	1	0	1	3	1			
Danger	Swift river	0	Draw +2	1	0	1	3	1			
Danger	Raft	0	Life +1	1	0	1	3	1			
Danger	Rocky shore	0	Stage -1	1	0	1	3	1			
Danger	Scarce food	0	Destroy	1	0	1	3	1			
Danger	Steep slope	0	Life +1	1	0	1	3	1			
Danger	Mosquitoes	0	Exchange 2	1	0	1	3	1			
Danger	Closed chest	0	Exchange 2	1	0	1	3	1			
Aging	Nauseous	0		2					Old	Highest 0	
Aging	Wounded	-2		2					Old		
Aging	Exhausted	0		2					Old	Stop	
Aging	Very weak	-1		2					Old		
Aging	Sick	0		2					Old	Life -1	
Aging	Very stupid	-3		2					Old		
Aging	Terrified	-2		2					Old		
Aging	Dizzy	0		2					Old	Highest 0	
Aging	Suicidal	-5		2					Very old		
Aging	Very old	-4		2					Very old		
Aging	Very sick	0		2					Very old	Life -2	
Pirates	6 pirates	20						6			none
Pirates	7 pirates	25						7			none
Pirates	8 pirates	30						8			none
Pirates	9 pirates	35						9			none
Pirates	10 pirates	40						10			none
Pirates	Scary pirates	22						9			Only half of your cards (round up) have any power
Pirates	Slow pirates	52						10			Each of your cards has +1 power
Pirates	Archers	16						7			Each extra card drawn costs 2 life instead of 1
Pirates	Swordsmen	X						5			Power X is number of aging cards added to game x2
Pirates	Pack of hounds	X						X			You have to beat all unbeaten danger cards at once`