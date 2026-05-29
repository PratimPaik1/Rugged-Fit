import React, { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const ImageUpload = ({ images, setImages, maxImages = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  // ✅ Cleanup memory
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    setImages((prev) => {
      const remainingSlots = maxImages - prev.length;

      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return prev;
      }
      const validFiles = files.filter(file => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          return false;
        }

        if (file.size > MAX_SIZE) {
          toast.error(`${file.name} exceeds 2MB`);
          return false;
        }

        return true;
      });

      const uniqueFiles = validFiles.filter(file =>
        !prev.some(img => img.file.name === file.name)
      );

      if (uniqueFiles.length !== validFiles.length) {
        toast.warn("Duplicate images ignored");
      }
      const filesToAdd = uniqueFiles.slice(0, remainingSlots);

      if (uniqueFiles.length > remainingSlots) {
        toast.warn(`Only ${remainingSlots} image(s) added (limit reached)`);
      }

      const newImages = filesToAdd.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      return [...prev, ...newImages];
    });
  };

  const removeImage = (index) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const isFull = images.length >= maxImages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
            Visual Assets
          </h4>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">
            High-Resolution Studio Shots Only
          </p>
        </div>
        <div className="text-[11px] font-black text-primary tracking-widest">
          {images.length} / {maxImages}
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isFull) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!isFull) addFiles(Array.from(e.dataTransfer.files));
          else toast.error(`Maximum ${maxImages} images reached`);
        }}
        onClick={() => {
          if (isFull) {
            toast.error(`Maximum ${maxImages} images reached`);
            return;
          }
          inputRef.current.click();
        }}
        className={`relative aspect-[21/9] border transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden group
        ${isFull
            ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed opacity-60'
            : isDragging
              ? 'bg-primary/5 border-primary/20 scale-[0.99] cursor-pointer'
              : 'bg-[#050505] hover:bg-[#080808] border-white/10 cursor-pointer'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={!isFull}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Background */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #333 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border border-white/10 flex items-center justify-center bg-black">
            <Upload
              className={isFull ? 'text-zinc-600' : 'text-zinc-500'}
              size={24}
            />
          </div>

          <div className="text-center">
            <p className="font-black text-white uppercase tracking-[0.4em] text-[10px]">
              {isFull ? 'Limit Reached' : 'Initialize Upload'}
            </p>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-2">
              {isFull
                ? `Maximum ${maxImages} images uploaded`
                : 'Drag & Drop or Click to Browse'}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div
              key={img.preview}
              className="group relative aspect-[3/4] bg-[#050505] border border-white/5 overflow-hidden"
            >
              <img
                src={img.preview}
                alt="preview"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300" />

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black border border-white/10 text-white flex items-center justify-center opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-black"
              >
                <X size={14} />
              </button>

              {/* Label */}
              <div className="absolute bottom-3 left-3">
                <span className="text-[8px] font-black text-white uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition duration-300">
                  Asset {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;