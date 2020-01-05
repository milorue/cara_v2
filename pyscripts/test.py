import osmnx as ox
import networkx as nx
import json
import requests
import matplotlib.cm as cm
import matplotlib.colors as colors
ox.config(use_cache=True, log_console=True)

g2 = ox.graph_from_address('953 Danby Rd, Ithaca, New York', network_type='walk')

# g = ox.graph_from_place('Annapolis, Maryland, USA', network_type='drive')
# fig, ax = ox.plot_graph(g2)

start = ox.get_nearest_node(g2, (42.423312, -76.495421))
end = ox.get_nearest_node(g2, (42.422116, -76.500056))

route = nx.shortest_path(g2, start, end, weight='length')

fig, ax =  ox.plot_graph_route(g2, route, node_size=0)

print(route)

routeJSON = []


for node in route:
    lat = (g2.nodes[node]['x'])
    lon = (g2.nodes[node]['y'])
    routeJSON.append({
        'latitude': lon,
        'longitude': lat
    })

with open('cara/assets/route.js', 'w') as outfile:
    json.dump(routeJSON, outfile)

