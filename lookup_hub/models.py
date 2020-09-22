from . import db


class Entry(db.Model):
    
    __tablename__ = 'lookup_hub'
    
    id = db.Column(
        db.Integer,
        primary_key = True
    )
    
    en = db.Column(
        db.String(),
        index=False,
        unique=False
    )
    
    de = db.Column(
        db.String(),
        index=False,
        unique=False
    )
    
    nl = db.Column(
        db.String(),
        index=False,
        unique=False
    )
    
    en_c = db.Column(
        db.String(),
        index=False,
        unique=False
    )
    
    de_c = db.Column(
        db.String(),
        index=False,
        unique=False
    )
    
    nl_c = db.Column(
        db.String(),
        index=False,
        unique=False
    )
    
    def __repr__(self):
        return f'<Dictionary entry {self.en}>'
    