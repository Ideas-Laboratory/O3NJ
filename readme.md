[O3NJ](https://ideas-laboratory.github.io/O3NJ/): Optimally Ordered Orthogonal Neighbor Joining
Trees for Hierarchical Cluster Analysis
====
We presented a novel visualization representation,
O3NJ trees, for hierarchical analysis of multi-dimensional
data. This representation is based on NJ trees, which so far
have been mostly used for phylogenetic data analysis in
biology.

### Example
O3NJ ***online demo*** can be found [here](https://ideas-laboratory.github.io/O3NJ/)  (or click title).  

### Install
You can also download our code and open ***index.html*** with Live Server.

### Start
Our system has two panels: a control panel (left) and a dashboard (right). The three views from left to right are the O3NJ tree, the distilled hierarchy, and the MDS projection.

When initialized, the NJ tree is optimally ordered and the hierarchy is automatically distilled with default values for our two thresholds. The color of the nodes in the tree and MDS plots encode their class labels in the data. For the distilled cluster tree, we colorize each leaf with the color of class who has outnumbered leaves in the corresponding leaf sequence in NJ tree. Meanwhile, the leaf correspond to all outliers are represented with a red ring.

the two slide bars in the control panel allow to modify the thresholds ARD, Alpha and Beta in our algorithm. ARD is in charge of re-cutting the NJ tree; Alpha is in charge of reordering the NJ tree; Beta for grading persistence. 

If you have problems, please submit an issue.
