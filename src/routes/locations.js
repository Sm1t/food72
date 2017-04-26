import testDefaultRoutes from '../resources/testDefaultRoutes';
import Location from '../models/location';


const defaultLocations = new testDefaultRoutes();
defaultLocations.init(Location, 'locations');

export default defaultLocations.router;