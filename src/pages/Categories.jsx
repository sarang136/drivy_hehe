import React, { useState } from 'react';
import {
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesMutation,
  useAddSubCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteSubCategoryMutation,
  useAddCategoryMutation,
  useUpdateSubCategoryMutation,
} from '../redux/apis/CategoriesApi';
import { toast } from 'react-toastify';
import { MdDelete, MdEdit } from 'react-icons/md';

const Categories = () => {
  const [openSubModal, setOpenSubModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [addCategoryInput, setAddCategoryInput] = useState('');
  const [addCategoryPercentage, setAddCategoryPercentage] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [imageURL, setImageURL] = useState();
  const [deleteCatModal, setDeleteCatModal] = useState(false);
  const [selectedDeleteCatId, setSelectedDeleteCatId] = useState('');

  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [subCatName, setSubCatName] = useState('');
  const [subCatTime, setSubCatTime] = useState('');
  const [subCatRate, setSubCatRate] = useState('');
  const [subCatHours, setSubCatHours] = useState('');  
  const [subCatImage, setSubCatImage] = useState(null);
  const [subCatImageUrl, setSubCatImageUrl] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [editingSubCatId, setEditingSubCatId] = useState(null);

  const { data: categoryData = [], refetch } = useGetAllCategoriesQuery();
  const [fetchSubCategories, { isLoading }] = useGetAllSubCategoriesMutation();
  const [addCategory, { isLoading: forCatLoading }] = useAddCategoryMutation();
  const [addSubCategory, { isLoading: forSubCatLoading }] = useAddSubCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [updateSubCategory, { isLoading: forUpdateLoading }] = useUpdateSubCategoryMutation();

  const handleCategoryClick = async (categoryName) => {
    setOpenSubModal(true);
    setSelectedCategory(categoryName);
    try {
      const response = await fetchSubCategories(categoryName).unwrap();
      setSubCategoryData(response);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };

  const handleSubCatDelete = async (subId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      await deleteSubCategory(subId).unwrap();
      toast.success('Subcategory deleted!');
      const refreshed = await fetchSubCategories(selectedCategory).unwrap();
      setSubCategoryData(refreshed);
    } catch (err) {
      toast.error('Failed to delete subcategory.');
    }
  };

  const handleAddCategory = async () => {
    if (!addCategoryInput.trim() || !addCategoryPercentage.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      await addCategory({
        name: addCategoryInput.trim(),
        precentage: addCategoryPercentage.trim(),
      }).unwrap();

      toast.success('Category Added Successfully');
      setAddCategoryInput('');
      setAddCategoryPercentage('');
      setShowAddInput(false);
      refetch();
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  const handleSubCatSubmit = async () => {
    if (!subCatName || !subCatTime || !subCatRate || !subCatHours || (!subCatImage && !editingSubCatId) || (!selectedCatId && !editingSubCatId)) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', subCatName.trim());
    formData.append('time', subCatTime.trim());
    formData.append('rate', subCatRate.trim());
    formData.append('hours', subCatHours.trim()); 
    if (subCatImage) formData.append('image', subCatImage);

    try {
      if (editingSubCatId) {
        await updateSubCategory({ subCategoryId: editingSubCatId, formData }).unwrap();
        toast.success('Subcategory updated successfully!');
      } else {
        await addSubCategory({ categoryId: selectedCatId, formData }).unwrap();
        toast.success('Subcategory added successfully!');
      }

      setShowAddSubModal(false);
      setSubCatName('');
      setSubCatTime('');
      setSubCatRate('');
      setSubCatHours('');
      setSubCatImage(null);
      setSubCatImageUrl('');
      setSelectedCatId('');
      setEditingSubCatId(null);

      if (selectedCategory) {
        const refreshed = await fetchSubCategories(selectedCategory).unwrap();
        setSubCategoryData(refreshed);
      }
    } catch (error) {
      alert('Upload failed. Check console for full error.');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedDeleteCatId) {
      alert('Please select a category to delete.');
      return;
    }

    try {
      await deleteCategory(selectedDeleteCatId).unwrap();
      toast.success('Category deleted successfully!');
      setSelectedDeleteCatId('');
      setDeleteCatModal(false);
      refetch();
    } catch (error) {
      alert('Failed to delete category.');
    }
  };

  if (!categoryData) return <div>Loading...</div>;
  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setShowAddInput(!showAddInput)}
          className="bg-[#CDFF00] text-black font-semibold px-6 py-2 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all"
        >
          Add Category
        </button>
        <button
          onClick={() => {
            setShowAddSubModal(true);
            setEditingSubCatId(null);
            setSubCatName('');
            setSubCatTime('');
            setSubCatRate('');
            setSubCatHours('');
            setSubCatImage(null);
            setSubCatImageUrl('');
          }}
          className="bg-[#CDFF00] text-black font-semibold px-6 py-2 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all"
        >
          Add Sub Category
        </button>
        <button
          onClick={() => setDeleteCatModal(true)}
          className="text-lg font-semibold hover:underline hover:text-[#CDFF00] transition"
        >
          Delete Category
        </button>
      </div>

      {/* Add Category Inputs */}
      {showAddInput && (
        <div className="flex gap-3 flex-wrap mb-8">
          <input
            type="text"
            placeholder="Enter category name"
            value={addCategoryInput}
            onChange={(e) => setAddCategoryInput(e.target.value)}
            className="border p-3 rounded-md w-full sm:max-w-xs shadow"
          />
          <input
            type="text"
            placeholder="Enter Percentage"
            value={addCategoryPercentage}
            onChange={(e) => setAddCategoryPercentage(e.target.value)}
            className="border p-3 rounded-md w-full sm:max-w-xs shadow"
          />
          <button
            onClick={handleAddCategory}
            className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
          >
            {forCatLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-6 border-b pb-3 mb-6">
        {categoryData.map((cat, index) => (
          <p
            key={index}
            onClick={() => handleCategoryClick(cat?.name)}
            className="text-lg font-medium text-[#444] hover:text-[#CDFF00] cursor-pointer transition"
          >
            {cat?.name}
          </p>
        ))}
      </div>

      {/* Subcategories */}
      {openSubModal && (
        <div>
          <h2 className="text-2xl font-bold mb-5">
            Subcategories of <span className="text-[#CDFF00]">{selectedCategory}</span>
          </h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : subCategoryData?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subCategoryData.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-white border rounded-lg p-4 shadow hover:shadow-xl transition-all"
                >
                  <img
                    src={sub.Image}
                    alt={sub.name}
                    className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:scale-105 transition"
                    onClick={() => {
                      setShowImage(true);
                      setImageURL(sub.Image);
                    }}
                  />
                  <h3 className="text-lg font-semibold mb-1">{sub.name}</h3>
                  <p className="text-sm mb-1">Time: {sub.time}</p>
                  <p className="text-sm mb-1">Rate: ₹{sub.rate}</p>
                  <p className="text-sm">Hours: {sub.hours}</p>
                  <div className="flex justify-end gap-4 mt-3">
                    <MdDelete
                      size={22}
                      className="text-red-600 cursor-pointer hover:scale-110 transition"
                      onClick={() => handleSubCatDelete(sub._id)}
                    />
                    <MdEdit
                      size={22}
                      className="text-blue-600 cursor-pointer hover:scale-110 transition"
                      onClick={() => {
                        setEditingSubCatId(sub._id);
                        setSubCatName(sub.name);
                        setSubCatTime(sub.time);
                        setSubCatRate(sub.rate);
                        setSubCatHours(sub.hours || '');
                        setSelectedCatId(sub.CategoryId);
                        setSubCatImage(null);
                        setSubCatImageUrl(sub.Image);
                        setShowAddSubModal(true);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No subcategories found.</p>
          )}
        </div>
      )}

      {/* Image Modal */}
      {showImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-50 flex justify-center items-center">
          <div className="relative">
            <button onClick={() => setShowImage(false)} className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md">×</button>
            <img src={imageURL} alt="Preview" className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg" />
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showAddSubModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editingSubCatId ? 'Edit' : 'Add'} Sub Category</h2>
            {!editingSubCatId && (
              <>
                <label className="block mb-1">Select Category</label>
                <select value={selectedCatId} onChange={(e) => setSelectedCatId(e.target.value)} className="border p-2 rounded w-full mb-4">
                  <option value="">Select a category</option>
                  {categoryData.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </>
            )}
            <input type="text" placeholder="Name" value={subCatName} onChange={(e) => setSubCatName(e.target.value)} className="border p-2 rounded w-full mb-3" />
            <input type="text" placeholder="Time" value={subCatTime} onChange={(e) => setSubCatTime(e.target.value)} className="border p-2 rounded w-full mb-3" />
            <input type="text" placeholder="Rate" value={subCatRate} onChange={(e) => setSubCatRate(e.target.value)} className="border p-2 rounded w-full mb-3" />
            <input type="text" placeholder="Hours" value={subCatHours} onChange={(e) => setSubCatHours(e.target.value)} className="border p-2 rounded w-full mb-3" /> {/* ✅ NEW INPUT */}
            <input type="file" accept="image/*" onChange={(e) => setSubCatImage(e.target.files[0])} className="mb-2" />
            {subCatImageUrl && !subCatImage && (
              <img src={subCatImageUrl} alt="Existing" className="w-24 h-24 rounded object-cover mb-2" />
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowAddSubModal(false); setEditingSubCatId(null); setSubCatImageUrl(''); setSubCatHours(''); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleSubCatSubmit} className="px-4 py-2 bg-[#CDFF00] text-black font-semibold rounded">
                {forSubCatLoading || forUpdateLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteCatModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Category</h2>
            <select value={selectedDeleteCatId} onChange={(e) => setSelectedDeleteCatId(e.target.value)} className="border p-2 rounded w-full mb-4">
              <option value="">-- Select a category --</option>
              {categoryData.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteCatModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleDeleteCategory} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
