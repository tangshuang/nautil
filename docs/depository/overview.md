# Depository

Depository is a mechanism to request data from backend. Let's think a backend api as a data source, we get data from a data source and store it in a depository, so that we can get data from depository directly without sending an ajax.

Depository seprate frontend from backend, we do not need to care about ajax requesting, we just define data sources and get data from depository. This make it very easy to operate data in Nauitl.
