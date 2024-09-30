import {Route,Routes} from 'react-router-dom'
import ReadHistoriaclPlaces from './readHistoriaclPlaces';
import CreateHistoricalPlaces from './createHistoricalPlaces';
import UpdateHistoriaclPlaces from './updateHistoriaclPlaces';
import DeleteHistoriaclPlaces from './deleteHistoriaclPlaces';


const historicalPlacesRouting = () => {
    return (
            <Routes>
                <Route path='/' element={<ReadHistoriaclPlaces />} />
                <Route path='/historicalPlace/create' element={<CreateHistoricalPlaces />} />
                <Route path='/historicalPlace/update/:id' element={<UpdateHistoriaclPlaces />} />
                <Route path='/historicalPlace/delete/:id' element={<DeleteHistoriaclPlaces />} />
            </Routes>
      );
}

export default historicalPlacesRouting