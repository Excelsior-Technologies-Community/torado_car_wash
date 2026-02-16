import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { vehicleCategoriesAPI, washPackagesAPI } from '../api';

const WashPackageConnections = () => {
  const [packages, setPackages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [featureForm, setFeatureForm] = useState({
    wash_package_id: '',
    feature_id: '',
  });

  const [pricingForm, setPricingForm] = useState({
    wash_package_id: '',
    vehicle_category_id: '',
    final_price: '',
  });

  const packageOptions = useMemo(
    () => packages.map((pkg) => ({ id: pkg.id, label: pkg.title || pkg.name || `#${pkg.id}` })),
    [packages]
  );

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [{ data: packageData }, { data: featureData }, { data: vehicleData }] = await Promise.all([
        washPackagesAPI.getAll(),
        washPackagesAPI.getAllFeatures(),
        vehicleCategoriesAPI.getAll(),
      ]);

      const list = packageData?.data || packageData || [];
      const featureList = featureData?.data || featureData || [];
      const vehicleList = vehicleData?.data || vehicleData || [];

      setPackages(Array.isArray(list) ? list : []);
      setFeatures(Array.isArray(featureList) ? featureList : []);
      setVehicleCategories(Array.isArray(vehicleList) ? vehicleList : []);
    } catch (error) {
      toast.error('Failed to load wash package connection data');
    } finally {
      setLoading(false);
    }
  };

  const addFeatureToPackage = async (e) => {
    e.preventDefault();
    if (!featureForm.wash_package_id || !featureForm.feature_id) return;

    try {
      setSaving(true);
      await washPackagesAPI.assignFeature({
        wash_package_id: Number(featureForm.wash_package_id),
        feature_id: Number(featureForm.feature_id),
      });
      toast.success('Feature linked to package');
      setFeatureForm((prev) => ({ ...prev, feature_id: '' }));
      await fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to link feature');
    } finally {
      setSaving(false);
    }
  };

  const removeFeatureFromPackage = async (washPackageId, featureId) => {
    try {
      setSaving(true);
      await washPackagesAPI.removeFeature({
        wash_package_id: washPackageId,
        feature_id: featureId,
      });
      toast.success('Feature removed from package');
      await fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove feature');
    } finally {
      setSaving(false);
    }
  };

  const savePricing = async (e) => {
    e.preventDefault();
    if (!pricingForm.wash_package_id || !pricingForm.vehicle_category_id || !pricingForm.final_price) return;

    try {
      setSaving(true);
      await washPackagesAPI.setPricing({
        wash_package_id: Number(pricingForm.wash_package_id),
        vehicle_category_id: Number(pricingForm.vehicle_category_id),
        final_price: Number(pricingForm.final_price),
      });
      toast.success('Package pricing saved');
      setPricingForm((prev) => ({ ...prev, final_price: '' }));
      await fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save pricing');
    } finally {
      setSaving(false);
    }
  };

  const removePricing = async (pricingId) => {
    try {
      setSaving(true);
      await washPackagesAPI.deletePricing(pricingId);
      toast.success('Pricing removed');
      await fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove pricing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading wash package links...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Wash Package Links</h1>
        <p className="text-sm text-gray-600 mt-2">
          Relation model: <strong>wash_packages &lt;-&gt; wash_features</strong> is many-to-many via
          <code className="ml-1">wash_package_features</code>. Vehicle pricing is stored in
          <code className="ml-1">wash_package_vehicle_pricing</code>.
        </p>
      </div>

      <section className="bg-white rounded-lg border p-5">
        <h2 className="text-xl font-semibold text-gray-800">Feature Assignment (Many-to-Many)</h2>
        <form onSubmit={addFeatureToPackage} className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <select
            className="border rounded-lg px-3 py-2"
            value={featureForm.wash_package_id}
            onChange={(e) => setFeatureForm((prev) => ({ ...prev, wash_package_id: e.target.value }))}
            required
          >
            <option value="">Select package</option>
            {packageOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
          <select
            className="border rounded-lg px-3 py-2"
            value={featureForm.feature_id}
            onChange={(e) => setFeatureForm((prev) => ({ ...prev, feature_id: e.target.value }))}
            required
          >
            <option value="">Select feature</option>
            {features.map((feature) => (
              <option key={feature.id} value={feature.id}>{feature.name}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Link Feature'}
          </button>
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Package</th>
                <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Linked Features</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} className="border-t">
                  <td className="px-4 py-3 text-sm text-gray-700">{pkg.title || pkg.name || `#${pkg.id}`}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {(pkg.features || []).length === 0 && (
                        <span className="text-xs text-gray-500">No linked features</span>
                      )}
                      {(pkg.features || []).map((feature) => (
                        <button
                          key={`${pkg.id}-${feature.id}`}
                          type="button"
                          onClick={() => removeFeatureFromPackage(pkg.id, feature.id)}
                          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-red-100 text-gray-700"
                          title="Click to remove relation"
                        >
                          {feature.name} x
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-lg border p-5">
        <h2 className="text-xl font-semibold text-gray-800">Package Vehicle Pricing</h2>
        <form onSubmit={savePricing} className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
          <select
            className="border rounded-lg px-3 py-2"
            value={pricingForm.wash_package_id}
            onChange={(e) => setPricingForm((prev) => ({ ...prev, wash_package_id: e.target.value }))}
            required
          >
            <option value="">Select package</option>
            {packageOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
          <select
            className="border rounded-lg px-3 py-2"
            value={pricingForm.vehicle_category_id}
            onChange={(e) => setPricingForm((prev) => ({ ...prev, vehicle_category_id: e.target.value }))}
            required
          >
            <option value="">Select vehicle category</option>
            {vehicleCategories.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Final price"
            className="border rounded-lg px-3 py-2"
            value={pricingForm.final_price}
            onChange={(e) => setPricingForm((prev) => ({ ...prev, final_price: e.target.value }))}
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Pricing'}
          </button>
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Package</th>
                <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Vehicle Category</th>
                <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Final Price</th>
                <th className="text-left px-4 py-2 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {packages.flatMap((pkg) =>
                (pkg.pricing || []).map((price) => (
                  <tr key={price.id} className="border-t">
                    <td className="px-4 py-3 text-sm text-gray-700">{pkg.title || pkg.name || `#${pkg.id}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{price.vehicle_category_name || `#${price.vehicle_category_id}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">${price.final_price}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removePricing(price.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default WashPackageConnections;
