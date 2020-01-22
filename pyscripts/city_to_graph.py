import osmnx as ox
import networkx as nx

ox.config(use_cache=True, log_console=True)

graph = ox.graph_from_address('953 Danby Rd, Ithaca, New York', network_type='walk')

fig, ax = ox.plot_graph(graph)