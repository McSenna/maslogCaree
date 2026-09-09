import InventoryScreen from "@/screens/InventoryScreen";

/**
 * Inventory Management.
 *
 * Every staff role renders the same screen: the server returns the
 * capabilities the signed-in role has and the screen draws only those
 * actions, so the roles cannot drift apart into separate implementations.
 */
const InventoryRoute = () => <InventoryScreen />;

export default InventoryRoute;
