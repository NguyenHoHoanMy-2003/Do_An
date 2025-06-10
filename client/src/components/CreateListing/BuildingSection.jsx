
import React from 'react';

const BuildingSection = ({
  buildings,
  buildingName,
  floorName,
  isAddingBuilding,
  isAddingFloor,
  newBuildingName,
  newFloorName,
  handleBuildingSelect,
  handleFloorSelect,
  handleAddBuilding,
  handleAddFloor,
  handleDeleteBuilding,
  handleDeleteFloor,
  setNewBuildingName,
  setNewFloorName
}) => {
  return (
    <div className="location-row">
      <div className="location">
        <p>Building's Name</p>
        {isAddingBuilding ? (
          <div className="add-new">
            <input
              type="text"
              placeholder="Enter building's name"
              value={newBuildingName}
              onChange={(e) => setNewBuildingName(e.target.value)}
            />
            <button onClick={handleAddBuilding}>Add</button>
          </div>
        ) : (
          <select value={buildingName} onChange={handleBuildingSelect}>
            <option value="">Select Building</option>
            {Object.keys(buildings).map((buildingName) => (
              <option key={buildings[buildingName].id} value={buildingName}>
                {buildingName}
              </option>
            ))}
            <option value="add">Add New Building...</option>
          </select>
        )}
        {buildingName && !isAddingBuilding && (
          <button onClick={handleDeleteBuilding} className="delete-btn">
            Delete Building
          </button>
        )}
      </div>

      {buildingName && (
        <div className="floor">
          <p>Floor</p>
          {isAddingFloor ? (
            <div className="add-new">
              <input
                type="text"
                placeholder="Enter floor name"
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
              />
              <button onClick={handleAddFloor}>Add Floor</button>
            </div>
          ) : (
            <>
              <select value={floorName} onChange={handleFloorSelect}>
                <option value="">Select Floor</option>
                {buildings[buildingName]?.floors.map((floor) => (
                  <option key={floor.id} value={floor.name}>
                    {floor.name}
                  </option>
                ))}
                <option value="add">Add New Floor...</option>
              </select>
              <ul className="floor-list">
                {buildings[buildingName]?.floors.map((floor) => (
                  <li key={floor.id}>
                    {floor.name}
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteFloor(floor.id, floor.name)}
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BuildingSection; 
