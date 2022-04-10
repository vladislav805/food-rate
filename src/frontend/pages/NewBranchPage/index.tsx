import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import type { IRegion, IRestaurant } from '@typings/objects';
import { useDataProvider } from '@frontend/provider';
import withLabel from '@components/withLabel';
import Input from '@components/Input';
import Button from '@components/Button';
import { useFetch } from '@utils/useFetch';
import Spinner from '@components/Spinner';
import { GlobalContext } from '@components/GlobalContext';
import Select, { SelectChanger } from '@components/Select';
import { IList } from '@typings';

export interface IBranchCreatePageData {
    restaurant: IRestaurant;
    regions: IList<IRegion>;
}

const InputWithLabel = withLabel(Input);
const SelectWithLabel = withLabel(Select);

const NewBranchPage: React.FC = () => {
    const params = useParams<'restaurantId'>();
    const provider = useDataProvider();
    const globalContext = React.useContext(GlobalContext);

    const { result, loading } = useFetch(`r${params.restaurantId}/b/new`, provider.preCreateBranchData, Number(params.restaurantId));

    const [busy, setBusy] = React.useState<boolean>(false);
    const [address, setAddress] = React.useState<string>('');
    const [region, setRegion] = React.useState<string>(globalContext.location?.code || '');
    // const [center, setCenter] = React.useState<IMapCenter>({ latitude: 60, longitude: 30 });
    // const [place, setPlace] = React.useState<IMapCenter | undefined>();
    const [zoom, setZoom] = React.useState<number>(9);

    const navigate = useNavigate();

    const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // if (!place) {
        //     alert('Не указано место');
        //     return;
        // }

        setBusy(true);

        provider.createBranch(result!.restaurant.id, address, /* place.latitude, place.longitude */ 0, 0, region).then(branch => {
            navigate(`/restaurant/${result!.restaurant.id}/branch/${branch.id}`);
        });
    }, [result, provider, address, region]);

    const regionsList = React.useMemo(() => {
        if (!result) return [];
        return result.regions.items.map(region => ({ value: region.code, title: region.region }));
    }, [result]);

    if (!result || loading) return <Spinner />;

    return (
        <form onSubmit={onSubmit}>
            <InputWithLabel
                type="text"
                label="Адрес"
                name="address"
                id="address"
                value={address}
                setValue={setAddress}
                readOnly={busy}
            />
            <SelectWithLabel
                id="regionCode"
                label="Регион"
                value={region}
                setValue={setRegion as SelectChanger}
                items={regionsList}
            />
            {/*<Map
                center={center}
                setCenter={setCenter}
                zoom={zoom}
                setZoom={setZoom}
            />*/}
            <Button
                type="submit"
                text="Создать"
                disabled={!address}
            />
        </form>
    );
};

export default NewBranchPage;
