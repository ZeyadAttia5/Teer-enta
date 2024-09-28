import {Route,Routes} from 'react-router-dom'
import ReadHistoriaclPlaces from './readHistoriaclPlaces';
import CreateHistoriaclPlaces from './createHistoriaclPlaces';
import UpdateHistoriaclPlaces from './updateHistoriaclPlaces';
import DeleteHistoriaclPlaces from './deleteHistoriaclPlaces';


const historicalPlacesRouting = () => {
    return (
            <Routes>
                <Route path='/' element={<ReadHistoriaclPlaces />} />
                <Route path='/historicalPlaces/create' element={<CreateHistoriaclPlaces />} />
                <Route path='/historicalPlaces/update/:id' element={<UpdateHistoriaclPlaces />} />
                <Route path='/historicalPlaces/delete/:id' element={<DeleteHistoriaclPlaces />} />
            </Routes>
      );
}

export default historicalPlacesRouting