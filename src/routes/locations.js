import defaultRoutes from '../resources/defaultRoutes';
import Location from '../models/location';


const defaultLocations = new defaultRoutes();
defaultLocations.init(Location, 'locations');

export default defaultLocations.router;