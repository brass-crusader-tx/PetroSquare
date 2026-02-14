import requests
import sys

BASE_URL = "http://localhost:3000"

def test_basins_categorization():
    print("Testing Basins categorization...")
    try:
        # Get Basins Layer
        layers_res = requests.get(f"{BASE_URL}/api/gis/layers")
        layers = layers_res.json()['data']
        basins_layer = next(l for l in layers if l['id'] == 'l-basins')

        # Get Features
        features_res = requests.get(f"{BASE_URL}/api/gis/layers/{basins_layer['id']}/features")
        features = features_res.json()['data']

        # Check Type
        first_basin = features[0]
        if first_basin['properties'].get('type') == 'BASIN':
            print("SUCCESS: Basin type is 'BASIN'")
        else:
            print(f"FAILURE: Basin type is {first_basin['properties'].get('type')}")
            sys.exit(1)

    except Exception as e:
        print(f"TEST FAILED: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_basins_categorization()
