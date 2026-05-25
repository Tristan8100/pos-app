import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Discount } from "../types/discount.types"

type Props = {
    update: (data: Discount)=> void,
    data: Discount,
}

export default function EditDiscount({update, data}: Props) {
    const [discount, setDiscount] = useState<Discount>({
        id: data.id,
        name: data.name,
        discount: data.discount,
        remove_vat: data.remove_vat
    })

    const submit = () => {
        update(discount)
    }

  return (
    <Dialog>
    <DialogTrigger className="border">Edit Discount</DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
            <Input placeholder="Enter discount name" value={discount.name} onChange={(e) => setDiscount({...discount, name: e.target.value})}/>
            <Input placeholder="Enter discount value" value={discount.discount} onChange={(e) => setDiscount({ ...discount, discount: Number(e.target.value) })} />
            <Switch
                id="vat"
                checked={discount.remove_vat}
                onCheckedChange={() => setDiscount({ ...discount, remove_vat: !discount.remove_vat })}
            />
            <Button onClick={submit}>Create</Button>
        </DialogDescription>
        </DialogHeader>
    </DialogContent>
    </Dialog>
  )
}