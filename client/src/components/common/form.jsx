import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled
}) {
  function renderInput(control) {
    let element = null;
    const value = formData[control.name] || "";
    switch (control.componentType) {
      case "input":
        element = (
          <Input
            name={control.name}
            placeholder={control.placeholder}
            type={control.type}
            id={control.name}
            value={value}
            onChange={(event) =>
              setFormData({ ...formData, [control.name]: event.target.value })
            }
          />
        );
        break;

      case "select":
  element = (
    <Select
      value={formData[control.name] || ""}
      onValueChange={(val) =>
        setFormData({ ...formData, [control.name]: val })
      }
    >
      <SelectTrigger className="w-full text-black">
        <SelectValue placeholder={control.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {control.options?.map((optionItem) => (
          <SelectItem
            key={optionItem.id}
            value={optionItem.label}   // must exactly match stored value
            className="text-black"
          >
            {optionItem.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  break;

      case "textarea":
        element = (
          <Textarea
            name={control.name}
            placeholder={control.placeholder}
            id={control.id}
            value={value}
            onChange={(event) =>
              setFormData({ ...formData, [control.name]: event.target.value })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            name={control.name}
            placeholder={control.placeholder}
            type={control.type}
            id={control.name}
            value={value}
            onChange={(event) =>
              setFormData({ ...formData, [control.name]: event.target.value })
            }
          />
        );
        break;
    }
    return element;
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control) => (
          <div className="grid w-full gap-1.5" key={control.name}>
            <Label className="mb-1">{control.label}</Label>
            {renderInput(control)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}
