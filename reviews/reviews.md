# Review 1

## Overview:
	This paper investigates several modelling solutions in the RDF ecosystem to model 'context associations'. Such context can include provenance, annotation data or access policies for the given data. In other words, metadata. The paper presents a set of requirements for modelling such context and then discusses a set of solutions that include well known modeling patterns such as named graphs, reification, singleton properties etc. These solutions are compared to the requirements and then also evaluated for efficency using a limited case study. The authors conclude that the necessary elements can be modelled using out-of-the-box RDF solutions.

## Relevance	
4: good
##clearly matches ISWC scope

## Positioning wrt state of the art	
2: poor
Overview is nice, but it is unclear how the work progresses the SotA, specifically wrt
Frey, J., Müller, K., Hellmann, S., Rahm, E., Vidal, M.-E.: Evaluation of metadata representations in RDF stores. Semantic Web. 10, 205–229 (2019)."

## Novelty	
2: marginal
See above. It is not really clear to me how these results are novel beyond the SotA

## Potential impact	
3: good
ok, but applicability is not entirely clear.
The conclusion seems to be that RDF can be used to model context. But we more or less knew that already?

## Readability	
3: fair
Mostly good, although some statements leading to requirements are not easy to parse. Examples could help (see review)

## Technical soundness	
4: good
sound research and experimentation

## Reproducibility	
4: good
Code is listed (the datasets are not found, would need to be generated using the code)

## Strengths	
- Nice setup with requirements, discussion of potential solutions
- Two-pronged evaluation of solutions, both wrt effectiveness and efficiency

## Weaknesses	- progress beyond SotA is unclear to me
- limited evaluation with one scenario makes it unclear how generalizable the results are

## Questions to the authors	


## Detailed Review	
This paper investigates several modelling solutions in the RDF ecosystem to model 'context associations'. Such context can include provenance, annotation data or access policies for the given data. In other words, metadata. The paper presents a set of requirements for modelling such context and then discusses a set of solutions that include well known modeling patterns such as named graphs, reification, singleton properties etc. These solutions are compared to the requirements and then also evaluated for efficiency using a limited case study. The authors conclude that the necessary elements can be modelled using out-of-the-box RDF solutions.


One issue I have with the paper is that there seems to be little progression beyond the state of the art. Specifically with respect to identification of the annotation mechanisms used in [1]. There also do the authors describe said mechanisms, describe pros and cons and investigate efficiency using several experimental setups.


Some statements are vague. For example in these crucial statements: On P4 ", the combined evaluation of requirements for context and data in these cases is not supported by native RDF tooling such as SPARQL." or on P5: "However, as no formal interpretation is given in these models for how the target should be interpreted, the provision of a local identifier that is interpreted as denoting a set of statements in the local scope can be used to define local expressions of provenance and policies over data without needing to change the expression or interpretation of the context models" are not really clear to me. I suggest splitting them up and clearly describing what exactly is the problem. Similarly in R1 (P6): what is 'an exact set of statements'? Maybe here an example could help.

The evaluation of the efficiency of the various solutions is done using one scenario where information is to be provided based on the user's age. There is quite some information missing about the setup and the features of the dataset. Fig 2 suggests that there are four different sizes used? As some of these decisions regarding the experimental setup are not clear either from the paper or the github readme, I find it difficult to assess to what extent these experimental results can be generalized to arbitrary context statements. I would suggest making this much clearer and ideally, testing this in multiple scenarios or with multiple benchmarks.

In section 4 I miss a discussion of what solutions like Trusty URIs (for example used in Nanopublications) would bring to the table with respect to the solutions: https://trustyuri.net/ . Maybe I misunderstand and it is not relevant at all, but the authors could explain this still in related work or discussion.

In Section 4.2 there is a statement that triple-based annotation would lead to 'unacceptable performance'. Unacceptable for what/who? Is this experimentally derived? Does it depend on the exact use case or is this always unacceptable?

Also in 4.2 there is the introduction of collections (of statements), could this also be done using native RDF constructs such as rdf:List. Why (not)? What would the difference be?


## Small things and typos
- Listing 4 misses a "_:" for statement2
- In S4.1 there is a discussion on SPARQL CONSTRUCTs not being usable for inserting things into named graphs, but this is possible with INSTRUCT queries, right?
- P13 there is some repetition in the paper wrt Section 4 (the tterm model for example)


[1] Frey, J., Müller, K., Hellmann, S., Rahm, E., Vidal, M.-E.: Evaluation of metadata representations in RDF stores. Semantic Web. 10, 205–229 (2019)."


*** UPDATE AFTER REBUTTAL ***

I would like to thank the authors for their careful rebuttal. I did not really ask any clarification questions, but some things indeed are clearer now. My main two points of critique were
a) unclear progression beyond SotA. Here there is some clarification, but the paper would benefit from a more clear description on how this new work contributes to new insights about the different modelling solutions. A clearer structure to the Related Work and the clear definition of the 'delta' would help here.
b) the evaluation is limited evaluation and also lacks detail. The rebuttal does acknowledge this, but improving this would require some additional empirical research.

All in all, the paper in its current form is for me still a borderline paper. I think with some more improvement this would be an interesting contribution to the community. I will maintain my final recommendation/score.

## Overall evaluation and recommendation	
0: borderline



# Review 2 

## Overview	
The paper proposes an RDF-based model for the inclusion of personal data in web ecosystems by integrating associations of context information to referenceable sets of statements. Three fundamental requirements are taken into accout in this work: (R1) a context association must define an exact set of statements in the localscope that can be referenced from this local scope; (R2) a context association must re‐main immutable under exchange, storage and processing with external data; (R3) a context association model must not prevent recursive expressions of context.
The paper considers different alternatives for doing this using RDF modelling and querying tools, and conclude that the objective can be achieved in different ways, with pros and cons for each of them.

## Relevance	
3: fair
The problem of storing and sharing personal data in web ecosystems has been raised several times in the past, but to the best of my knowledge the adoption is still very limited and complex from a technical point of view. Even though the approach is conceptually very interestimg (and 15 years ago I was personally engaged in a similar project), I'm afraid that the relevance for the ISWC community is quite limited.

## Positioning wrt state of the art	
4: good
The semantic web references are complete, perhaps the author(s) might consider and discuss past work on modelling contexts in RDF and OWL.

## Novelty	
3: fair
The paper offers more a feasibility study than a novel contribution from the technical or conceptual point of view.

## Potential impact	
2: low
As I said above, my feeling is that this approach to personal data management on the web is very intriguing but extremely difficult and costly to use in practice. So I'm afraid that the take-up will be very limited.

## Readability	
4: good
The paper is cleary written and its content is accessible to anyone in the ISWC community.

## Technical soundness	
4: good
The technical tools are discusse with competence and the methodology is valid.

## Reproducibility	
4: good
Datasets, queies and benchmarks are made available by author(s).

## Strengths	
- The issue of controlling the access and use of personal data in web ecosystems is very important
- The analysis of the alternative techniques for managing this using RDF and SPARQL is very accurate

## Weaknesses	
- Impact can be quite limited, due to the very marginal adoption of this type of personal data protection management
- The costs and conceptual difficulty of a similar approach are quite high on a large scale
- The examples in the paper are very simple, perhaps too simple to illustrate the potential (but also the costs) of the proposed approach

## Questions to the authors	
- Where do you see a real-world large scale adoption of this approach in web ecosystems (I mean, outside academia)?
- Can you provide an example which goes beyond the simple example used in the paper?
- How much of what you propose can be fully automated in real world scenarios?

## Detailed Review	
The paper proposes an RDF-based model for the inclusion of personal data in web ecosystems by integrating associations of context information to referenceable sets of statements. Three fundamental requirements are taken into accout in this work: (R1) a context association must define an exact set of statements in the localscope that can be referenced from this local scope; (R2) a context association must re‐main immutable under exchange, storage and processing with external data; (R3) a context association model must not prevent recursive expressions of context.
In my view, the issue of controlling the access and use of personal data in web ecosystems is very important and - in principle - will be more and more important as long as our personal data are used for many different purposes.
The paper in its current form sounds more like a feasibility study than like a novel proposal on how to do things in real worls scenarios. That's why I'm afraid that its impact could be quite limited, also due to the very marginal adoption of this type of personal data protection management.
The practical costs and conceptual difficulty of implementinf a similar approach are not fully discsussed, and the examples in the paper are too simple to illustrate the potential advantages (but also the costs) of adopting the proposed approach.
[EDIT AFTER AUTHOR RESPONSE] I'd like to thank the authors for their comments. I think the overall review process will help author(s) to improve the paper and clarify some issues for future work. My overall evaluation does not change, I still believe the paper in its current form does is borderline and needs more work to prove its impact on society.

## Overall evaluation and recommendation	
-1: weak reject


## Review 3
Please assign your marks and comments according to what the authors have been asked to write about, as described in the call for papers. For each criteria, you can explain in the text box why you assign the given value.
Overview	This article focuses on modeling the context associated with triples. It introduces the notion of "collection" (context associations) to group triples related to data.
I do not see any original contribution in this paper.

## Relevance	
2: poor
This paper is relevant to the domain of RDF and OWL specifications.

## Positioning wrt state of the art	
2: poor
The authors talks lightly on existing syntaxes for RDF reification.

## Novelty	
1: questionable
I believe that existing ontologies and syntaxes for expressing reification—such as named graphs, RDF-star, or Triple Terms—are sufficient to represent associated contexts.

## Potential impact	
1: very low
Since the problem already has several existing solutions, I do not see a significant impact

## Readability	
1: very poor
The paper lacks scientific rigor in its writing style.

## Technical soundness	
1: very poor
No, the problem statement is not well motivated. Both the proposed approach and the evaluation are highly questionable.

## Reproducibility	
1: very poor
There is an anonymous Git.

## Strengths	
Expressing context is an important topic, and the inclusion of Triple Terms in the RDF 1.2 specification highlights its relevance.

## Weaknesses	
There are numerous weaknesses.
- The motivation and problem statement are superficial and unconvincing.
- The state of the art is only briefly and insufficiently reviewed.
- The contribution is limited to a couple of loosely defined concepts.
- The evaluation lacks rigor and methodological clarity.

## Questions to the authors	
Detailed Review	This paper focuses on context-association for data on the Web. It introduces a few conceptual contributions and includes an empirical evaluation.
However, my main concern is that the problem is not clearly defined, and the necessity of the proposed concepts is not convincingly demonstrated. Furthermore, the evaluation lacks scientific rigor, as the dataset used and the SPARQL queries executed are not argued.

I acknowledge having read the authors’ rebuttal.

## Overall evaluation and recommendation	
-2: reject

# Review 4

## Overview	
The paper investigates how contextual information, such as provenance, policies, and signatures—can be modeled within RDF for Semantic Web ecosystems. It evaluates several RDF-native approaches to modeling context associations, including named graphs, reification, and triple terms, based on formal requirements: referenceability, immutability, and recursive applicability. It further benchmarks the scalability of these models under SPARQL query execution.

## Relevance	
4: good
Good fit to ISWC. Addresses trust, interoperability, and context-aware data integration in RDF.

## Positioning wrt state of the art	
3: fair
Adequate but lacks structure. Related work is mentioned but not compared. Overall, the related work section requires substantial revision and greater completeness.

## Novelty	
3: fair
Moderately original. Builds on known RDF mechanisms but applies them to a relevant problem with a structured requirements-based evaluation. However, the concept of data spaces is not so well-connected and justified.

## Potential impact	
3: good
The approach seems useful for Semantic Web research and standardization. It could inform implementations in data spaces and Solid. However, it seems limited due to the lack of real-world deployments

## Readability	
2: poor
Abstract is dense; introduction lacks clear problem statement and contributions. Related work and figures are not well integrated. Formatting issues (footnotes, references) impact clarity. In general, the manuscript would benefit from a more concise and cohesive structure that aligns more clearly with the problem statement."

## Technical soundness	
4: good
Solid methodology with well-justified requirements and technically correct evaluation. A few implementation details (e.g., handling blank-node graphs in SPARQL) could be clarified.

## Reproducibility	
4: good
The authors include a link to supplemental datasets and queries. Thus, evaluation is replicable.

## Strengths	
- The topic is timely and relevant, addressing the challenge of integrating contextual metadata in linked data environments.
- A practical benchmark is conducted to compare different modeling techniques with regard to SPARQL performance.
- The availability of code and datasets improves transparency and potential reproducibility.

Weaknesses	
- The abstract is verbose and difficult to follow. It fails to clearly state the core contribution and novelty of the work.
- The problem statement is not clearly formulated. The motivation and research objectives are buried within the introduction.
- The related work section, although rich in references, lacks structure and critical comparison.
- Formatting issues affect readability. References appear as footnotes or full URLs within the text. Figures are not clearly labeled or legible.
- The main contributions of the paper are not explicitly stated in a dedicated section, making it difficult to distinguish between background information and novel content.
- The evaluation methodology lacks sufficient detail. It is unclear how datasets were constructed, which queries were tested, and how variability was managed.

The running example (Bob’s age and name) is too simplistic and fails to capture real-world complexities of context modeling.

The discussion of research implications and future work is brief and does not explore potential integrations with real-world standards or architectures.
Questions to the authors	-Could you clarify what the core novel contribution is beyond adapting and comparing existing RDF modeling strategies?

- How does this approach compare with alternative data representation strategies like JSON-LD for Verifiable Credentials, particularly in terms of adoption and interoperability?
- Why is this problem relevant in the context of data spaces?

## Detailed Review	
The paper presents a relevant and interesting exploration of modeling context associations within RDF. The problem of managing and querying contextual metadata is significant in the Semantic Web, particularly in domains like data spaces and personal data stores. The authors provide a useful classification of modeling approaches and formalize a set of requirements that are helpful for evaluating them.

However, the paper suffers from significant weaknesses in structure, presentation, and empirical depth. The abstract should be rewritten to clearly highlight the contributions. The introduction should state the problem more explicitly and define clear research questions. The related work section needs to be restructured and expanded to reflect relevant state-of-the-art approaches.

The evaluation lacks methodological transparency. While the benchmarking is a valuable addition, more detail is needed on experimental design and reproducibility. Figures are blurry and inadequately captioned. A table comparing the approaches with pros and cons could help clarify the contributions.

Future work is underdeveloped. There is an opportunity to position this work within the context of European data space initiatives (e.g., Gaia-X, IDSA), but this is only briefly touched upon.

With a more refined structure, clearer articulation of contributions, and a more thorough evaluation, the paper has the potential to make a useful contribution to the community.

## Overall evaluation and recommendation	
-2: reject


# Metareview

The paper is clearly written and its content is accessible to anyone in the ISWC community. The technical tools are discussed with competence and the methodology is valid. However, the problem statement is not well motivated, the paper lacks scientific rigor in its writing style, the examples in the paper are very simple, perhaps too simple to illustrate the potential and, thus, the impact might be quite limited. The overview of SotA is nice, but it is unclear how the results of this work progress the SotA or what the applicability of the proposed solution is. The paper is readable but some statements leading to requirements are not easy to parse. The paper provides only a limited evaluation with one scenario makes it unclear how generalizable the results are. Based on the aforementioned, the reviewewrs think that the paper is not ready to be published in its current state.